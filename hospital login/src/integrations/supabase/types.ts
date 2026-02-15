export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      beds: {
        Row: {
          bed_number: string
          bed_type: string
          created_at: string
          id: string
          patient_id: string | null
          status: string
          ward: string
        }
        Insert: {
          bed_number: string
          bed_type?: string
          created_at?: string
          id?: string
          patient_id?: string | null
          status?: string
          ward: string
        }
        Update: {
          bed_number?: string
          bed_type?: string
          created_at?: string
          id?: string
          patient_id?: string | null
          status?: string
          ward?: string
        }
        Relationships: [
          {
            foreignKeyName: "beds_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          ai_performance_score: number | null
          availability_slots: Json | null
          consultation_count: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          department: string
          employment_status: string
          full_name: string
          id: string
          medical_license_number: string | null
          patient_rating: number | null
          role: string
          shift_timing: string | null
          specialization: string | null
          updated_at: string
          years_of_experience: number | null
        }
        Insert: {
          ai_performance_score?: number | null
          availability_slots?: Json | null
          consultation_count?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          department: string
          employment_status?: string
          full_name: string
          id?: string
          medical_license_number?: string | null
          patient_rating?: number | null
          role: string
          shift_timing?: string | null
          specialization?: string | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Update: {
          ai_performance_score?: number | null
          availability_slots?: Json | null
          consultation_count?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          department?: string
          employment_status?: string
          full_name?: string
          id?: string
          medical_license_number?: string | null
          patient_rating?: number | null
          role?: string
          shift_timing?: string | null
          specialization?: string | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          ai_risk_score: number | null
          created_at: string
          created_by: string | null
          data: Json | null
          description: string | null
          id: string
          patient_id: string
          record_type: string
          title: string
        }
        Insert: {
          ai_risk_score?: number | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          patient_id: string
          record_type: string
          title: string
        }
        Update: {
          ai_risk_score?: number | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          patient_id?: string
          record_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admission_date: string | null
          age: number | null
          allergies: string[] | null
          assigned_doctor_id: string | null
          chronic_conditions: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          gender: string | null
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          risk_level: string | null
          room_number: string | null
          status: string
          updated_at: string
          ward: string | null
        }
        Insert: {
          admission_date?: string | null
          age?: number | null
          allergies?: string[] | null
          assigned_doctor_id?: string | null
          chronic_conditions?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          risk_level?: string | null
          room_number?: string | null
          status?: string
          updated_at?: string
          ward?: string | null
        }
        Update: {
          admission_date?: string | null
          age?: number | null
          allergies?: string[] | null
          assigned_doctor_id?: string | null
          chronic_conditions?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          risk_level?: string | null
          room_number?: string | null
          status?: string
          updated_at?: string
          ward?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_assigned_doctor_id_fkey"
            columns: ["assigned_doctor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      treatments: {
        Row: {
          created_at: string
          description: string | null
          doctor_id: string | null
          end_date: string | null
          id: string
          outcome: string | null
          patient_id: string
          start_date: string
          status: string
          title: string
          treatment_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          doctor_id?: string | null
          end_date?: string | null
          id?: string
          outcome?: string | null
          patient_id: string
          start_date?: string
          status?: string
          title: string
          treatment_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          doctor_id?: string | null
          end_date?: string | null
          id?: string
          outcome?: string | null
          patient_id?: string
          start_date?: string
          status?: string
          title?: string
          treatment_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "nurse" | "accounts"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "doctor", "nurse", "accounts"],
    },
  },
} as const
