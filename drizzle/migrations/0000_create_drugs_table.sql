CREATE TABLE public.drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  drug_class text NOT NULL,
  synonyms text[] NOT NULL DEFAULT '{}',
  indication_oneliner text NOT NULL DEFAULT '',
  key_warning text NOT NULL DEFAULT '',
  adult_bolus_dose text NOT NULL DEFAULT '',
  infusion_range text NOT NULL DEFAULT '',
  presentation text NOT NULL DEFAULT '',
  mechanism_of_action text NOT NULL DEFAULT '',
  pharmacokinetics text NOT NULL DEFAULT '',
  preparation text NOT NULL DEFAULT '',
  dosing text NOT NULL DEFAULT '',
  monitoring text NOT NULL DEFAULT '',
  side_effects text NOT NULL DEFAULT '',
  contraindications text NOT NULL DEFAULT '',
  interactions text NOT NULL DEFAULT '',
  infusion_standard jsonb NOT NULL DEFAULT '{}'::jsonb,
  related_topic_ids text[] NOT NULL DEFAULT '{}',
  requires_tdm boolean NOT NULL DEFAULT false,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  tdm jsonb NOT NULL DEFAULT '{}'::jsonb,
  dilutions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.drugs TO anon;
GRANT SELECT ON public.drugs TO authenticated;
GRANT ALL ON public.drugs TO service_role;

ALTER TABLE public.drugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view drugs"
  ON public.drugs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX drugs_drug_class_idx ON public.drugs (drug_class);
CREATE INDEX drugs_name_idx ON public.drugs (lower(name));

CREATE OR REPLACE FUNCTION public.update_drugs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER drugs_updated_at
  BEFORE UPDATE ON public.drugs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_drugs_updated_at();