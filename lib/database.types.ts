export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      check_ins: {
        Row: {
          address: string;
          check_in_id: string;
          from_phone: string | null;
          geocoded: boolean;
          id: string;
          lat: number | null;
          lng: number | null;
          raw_text: string | null;
          received_at: string;
          when_text: string | null;
        };
        Insert: {
          address: string;
          check_in_id: string;
          from_phone?: string | null;
          geocoded?: boolean;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          raw_text?: string | null;
          received_at?: string;
          when_text?: string | null;
        };
        Update: {
          address?: string;
          check_in_id?: string;
          from_phone?: string | null;
          geocoded?: boolean;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          raw_text?: string | null;
          received_at?: string;
          when_text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "check_ins_check_in_id_fkey";
            columns: ["check_in_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["check_in_id"];
          },
        ];
      };
      vendors: {
        Row: {
          business_name: string;
          check_in_id: string;
          created_at: string;
          cuisine: string;
          description: string | null;
          email: string;
          facebook: string | null;
          id: string;
          instagram: string | null;
          menu_url: string | null;
          owner_name: string;
          phone: string;
          vendor_type: Database["public"]["Enums"]["vendor_type"];
          wants_free_website: boolean;
          website: string | null;
          x: string | null;
        };
        Insert: {
          business_name: string;
          check_in_id: string;
          created_at?: string;
          cuisine: string;
          description?: string | null;
          email: string;
          facebook?: string | null;
          id?: string;
          instagram?: string | null;
          menu_url?: string | null;
          owner_name: string;
          phone: string;
          vendor_type: Database["public"]["Enums"]["vendor_type"];
          wants_free_website?: boolean;
          website?: string | null;
          x?: string | null;
        };
        Update: {
          business_name?: string;
          check_in_id?: string;
          created_at?: string;
          cuisine?: string;
          description?: string | null;
          email?: string;
          facebook?: string | null;
          id?: string;
          instagram?: string | null;
          menu_url?: string | null;
          owner_name?: string;
          phone?: string;
          vendor_type?: Database["public"]["Enums"]["vendor_type"];
          wants_free_website?: boolean;
          website?: string | null;
          x?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      vendor_type: "truck" | "trailer" | "table" | "tent";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
