-- Migration: Create submit_ylc_confirmation RPC and session selections table
-- Date: 2026-08-27
-- Description: Supports both new and returning participants in the YLC confirmation form.

-- 1. Create a dedicated table to store participant session selections
CREATE TABLE IF NOT EXISTS public.applicant_session_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(applicant_id, session_name)
);

-- 2. Enable Row Level Security (RLS) on the selections table
ALTER TABLE public.applicant_session_selections ENABLE ROW LEVEL SECURITY;

-- Note: No public INSERT/UPDATE policies are added to applicant_session_selections.
-- Public writes must occur only through the security-definer RPC below.

-- 3. Create the submit_ylc_confirmation RPC function
CREATE OR REPLACE FUNCTION public.submit_ylc_confirmation(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_country TEXT,
    p_training_sessions TEXT[],
    p_admission_accepted BOOLEAN,
    p_mun_attendance_confirmed BOOLEAN,
    p_dress_code_acknowledged BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_trimmed_name TEXT;
    v_normalized_email TEXT;
    v_clean_phone TEXT;
    v_clean_country TEXT;
    v_clean_sessions TEXT[];
    v_session TEXT;
    
    v_applicant_id UUID;
    v_applicant_reference TEXT;
    v_existing_applicant BOOLEAN := false;
BEGIN
    -- =========================================================================
    -- A. INPUT NORMALIZATION
    -- =========================================================================
    v_trimmed_name := trim(p_full_name);
    v_normalized_email := lower(trim(p_email));
    
    IF p_phone IS NOT NULL AND trim(p_phone) <> '' THEN
        v_clean_phone := trim(p_phone);
    ELSE
        v_clean_phone := NULL;
    END IF;

    IF p_country IS NOT NULL AND trim(p_country) <> '' THEN
        v_clean_country := trim(p_country);
    ELSE
        v_clean_country := NULL;
    END IF;

    -- Trim, deduplicate, and remove blank values from session names
    IF p_training_sessions IS NOT NULL THEN
        SELECT array_agg(DISTINCT trimmed_session)
        INTO v_clean_sessions
        FROM (
            SELECT trim(s) AS trimmed_session
            FROM unnest(p_training_sessions) s
        ) sub
        WHERE trimmed_session IS NOT NULL AND trimmed_session <> '';
    END IF;

    -- =========================================================================
    -- B. VALIDATION (Matching submit_ylc_registration + session requirements)
    -- =========================================================================
    IF v_trimmed_name IS NULL OR v_trimmed_name = '' THEN
        RAISE EXCEPTION 'Full name is required.';
    END IF;

    IF p_email IS NULL OR trim(p_email) = '' THEN
        RAISE EXCEPTION 'Email address is required.';
    END IF;
    
    IF NOT (p_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
        RAISE EXCEPTION 'Invalid email address format.';
    END IF;

    IF p_admission_accepted IS DISTINCT FROM true OR 
       p_mun_attendance_confirmed IS DISTINCT FROM true OR 
       p_dress_code_acknowledged IS DISTINCT FROM true THEN
        RAISE EXCEPTION 'All three confirmations must be acknowledged.';
    END IF;

    IF v_clean_sessions IS NULL OR array_length(v_clean_sessions, 1) = 0 THEN
        RAISE EXCEPTION 'At least one valid training session must be selected.';
    END IF;

    -- =========================================================================
    -- C. RETURNING PARTICIPANT MATCHING
    -- =========================================================================
    -- Search for an existing applicant matching the normalized email.
    -- Deterministic tie-breaker:
    --   1. Prefer applicant with an existing record in payment_confirmations.
    --   2. Sort by oldest created_at first.
    --   3. OID/UUID as absolute final ordering.
    SELECT 
        a.id, 
        a.applicant_reference
    INTO 
        v_applicant_id, 
        v_applicant_reference
    FROM public.applicants a
    LEFT JOIN public.payment_confirmations pc ON pc.applicant_id = a.id
    WHERE lower(trim(a.email)) = v_normalized_email
    ORDER BY 
        (CASE WHEN pc.id IS NOT NULL THEN 0 ELSE 1 END) ASC,
        a.created_at ASC,
        a.id ASC
    LIMIT 1;

    -- =========================================================================
    -- D. TRANSACTION PROCESS & INSERT/UPDATE
    -- =========================================================================
    IF v_applicant_id IS NOT NULL THEN
        -- Case 1: Existing Applicant Found
        v_existing_applicant := true;

        -- Update ONLY the permitted fields.
        -- Do not touch email, applicant_reference, or created_at.
        -- CRITICAL: Historical payment records (payment_selections, payment_confirmations) 
        -- must NEVER be modified or deleted by this function.
        UPDATE public.applicants
        SET 
            full_name = v_trimmed_name,
            phone = v_clean_phone,
            country = v_clean_country,
            admission_accepted = p_admission_accepted,
            mun_attendance_confirmed = p_mun_attendance_confirmed,
            dress_code_acknowledged = p_dress_code_acknowledged
        WHERE id = v_applicant_id;

    ELSE
        -- Case 2: New Applicant
        -- Do not create payment_selections or payment_confirmations records.
        INSERT INTO public.applicants (
            full_name,
            email,
            phone,
            country,
            admission_accepted,
            mun_attendance_confirmed,
            dress_code_acknowledged
        ) VALUES (
            v_trimmed_name,
            v_normalized_email,
            v_clean_phone,
            v_clean_country,
            p_admission_accepted,
            p_mun_attendance_confirmed,
            p_dress_code_acknowledged
        )
        RETURNING id, applicant_reference INTO v_applicant_id, v_applicant_reference;
    END IF;

    -- =========================================================================
    -- E. SESSION AVAILABILITY SYNCHRONIZATION
    -- =========================================================================
    -- Delete previous session choices and write new selections.
    -- CRITICAL: This operation applies ONLY to the session availability table. 
    -- Payment records must never be modified by this function.
    DELETE FROM public.applicant_session_selections
    WHERE applicant_id = v_applicant_id;

    IF v_clean_sessions IS NOT NULL THEN
        FOREACH v_session IN ARRAY v_clean_sessions LOOP
            INSERT INTO public.applicant_session_selections (applicant_id, session_name)
            VALUES (v_applicant_id, v_session)
            ON CONFLICT (applicant_id, session_name) DO NOTHING;
        END LOOP;
    END IF;

    -- =========================================================================
    -- F. RETURN STATUS PAYLOAD
    -- =========================================================================
    IF v_existing_applicant THEN
        RETURN jsonb_build_object(
            'success', true,
            'existing_applicant', true,
            'applicant_id', v_applicant_id,
            'applicant_reference', v_applicant_reference,
            'message', 'Welcome back. Your availability has been updated.'
        );
    ELSE
        RETURN jsonb_build_object(
            'success', true,
            'existing_applicant', false,
            'applicant_id', v_applicant_id,
            'applicant_reference', v_applicant_reference,
            'message', 'Your registration and availability have been confirmed.'
        );
    END IF;
END;
$$;

-- 4. Grant execution permissions on the function to public database client roles
REVOKE EXECUTE ON FUNCTION public.submit_ylc_confirmation(TEXT, TEXT, TEXT, TEXT, TEXT[], BOOLEAN, BOOLEAN, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_ylc_confirmation(TEXT, TEXT, TEXT, TEXT, TEXT[], BOOLEAN, BOOLEAN, BOOLEAN) TO anon, authenticated;


-- =========================================================================
-- G. READ-ONLY VERIFICATION QUERIES
-- =========================================================================

-- 1. Verify applicant_session_selections table is created
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'applicant_session_selections';

-- 2. Verify RLS is enabled on applicant_session_selections
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'applicant_session_selections';

-- 3. Verify function created, signature, and security definer status
SELECT 
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    pg_get_function_result(p.oid) AS result_type,
    p.prosecdef AS is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'submit_ylc_confirmation';
