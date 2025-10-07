import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://habwycahldzwxreftesz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYnd5Y2FobGR6d3hyZWZ0ZXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDY0NjcsImV4cCI6MjA3NTQyMjQ2N30.TWRXYN6942fhPEPG4fT6UDRzPeu06abxrFkbwxhEVQQ"
);
