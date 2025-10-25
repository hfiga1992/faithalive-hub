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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcement_views: {
        Row: {
          announcement_id: string | null
          id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          announcement_id?: string | null
          id?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          announcement_id?: string | null
          id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_views_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          category: string
          church_id: string
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          is_pinned: boolean | null
          is_public: boolean | null
          is_urgent: boolean | null
          ministry_id: string | null
          publish_at: string | null
          target_profiles: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          church_id: string
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          is_public?: boolean | null
          is_urgent?: boolean | null
          ministry_id?: string | null
          publish_at?: string | null
          target_profiles?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          church_id?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          is_public?: boolean | null
          is_urgent?: boolean | null
          ministry_id?: string | null
          publish_at?: string | null
          target_profiles?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          recorded_at: string | null
          recorded_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      church_onboarding: {
        Row: {
          church_id: string
          completed_at: string | null
          created_at: string | null
          first_leader_added: boolean | null
          id: string
          ministries_customized: boolean | null
          step: number | null
          updated_at: string | null
        }
        Insert: {
          church_id: string
          completed_at?: string | null
          created_at?: string | null
          first_leader_added?: boolean | null
          id?: string
          ministries_customized?: boolean | null
          step?: number | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          completed_at?: string | null
          created_at?: string | null
          first_leader_added?: boolean | null
          id?: string
          ministries_customized?: boolean | null
          step?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_onboarding_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: true
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_plans: {
        Row: {
          church_id: string
          created_at: string | null
          expires_at: string | null
          features: Json | null
          id: string
          max_leaders: number | null
          max_members: number | null
          plan_type: string
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          expires_at?: string | null
          features?: Json | null
          id?: string
          max_leaders?: number | null
          max_members?: number | null
          plan_type: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          expires_at?: string | null
          features?: Json | null
          id?: string
          max_leaders?: number | null
          max_members?: number | null
          plan_type?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_plans_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: true
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_stats: {
        Row: {
          active_members: number | null
          average_attendance: number | null
          church_id: string
          created_at: string | null
          events_count: number | null
          id: string
          new_members: number | null
          stat_date: string
          total_members: number | null
        }
        Insert: {
          active_members?: number | null
          average_attendance?: number | null
          church_id: string
          created_at?: string | null
          events_count?: number | null
          id?: string
          new_members?: number | null
          stat_date: string
          total_members?: number | null
        }
        Update: {
          active_members?: number | null
          average_attendance?: number | null
          church_id?: string
          created_at?: string | null
          events_count?: number | null
          id?: string
          new_members?: number | null
          stat_date?: string
          total_members?: number | null
        }
        Relationships: []
      }
      churches: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cost_centers: {
        Row: {
          church_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          event_date: string
          event_type: string
          id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          church_id: string
          created_at: string | null
          current_balance: number | null
          description: string | null
          id: string
          initial_balance: number | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_accounts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          church_id: string
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          church_id: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_categories_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_contacts: {
        Row: {
          address: string | null
          church_id: string
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          phone2: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          church_id: string
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          phone2?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          church_id?: string
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          phone2?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_contacts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string | null
          church_id: string
          competency_date: string | null
          contact_id: string | null
          cost_center_id: string | null
          created_at: string | null
          created_by: string | null
          description: string
          document_number: string | null
          due_date: string | null
          id: string
          installment_number: number | null
          notes: string | null
          parent_transaction_id: string | null
          payment_type: Database["public"]["Enums"]["payment_type"] | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          total_installments: number | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id?: string | null
          church_id: string
          competency_date?: string | null
          contact_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          document_number?: string | null
          due_date?: string | null
          id?: string
          installment_number?: number | null
          notes?: string | null
          parent_transaction_id?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"] | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          total_installments?: number | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string | null
          church_id?: string
          competency_date?: string | null
          contact_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          document_number?: string | null
          due_date?: string | null
          id?: string
          installment_number?: number | null
          notes?: string | null
          parent_transaction_id?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"] | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          total_installments?: number | null
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "financial_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string
          email: string
          expires_at: string | null
          id: string
          is_used: boolean | null
          role: string
          token: string
          used_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by: string
          email: string
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          role: string
          token: string
          used_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string
          email?: string
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          role?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_settings: {
        Row: {
          church_id: string
          created_at: string | null
          error_message: string | null
          google_drive_credentials: Json
          google_drive_email: string | null
          google_drive_folder_id: string
          id: string
          is_connected: boolean | null
          last_sync: string | null
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          error_message?: string | null
          google_drive_credentials: Json
          google_drive_email?: string | null
          google_drive_folder_id: string
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          error_message?: string | null
          google_drive_credentials?: Json
          google_drive_email?: string | null
          google_drive_folder_id?: string
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_settings_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: true
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      ministries: {
        Row: {
          church_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          icon: string | null
          id: string
          internal_id: string | null
          is_active: boolean | null
          leader_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          church_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon?: string | null
          id?: string
          internal_id?: string | null
          is_active?: boolean | null
          leader_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon?: string | null
          id?: string
          internal_id?: string | null
          is_active?: boolean | null
          leader_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ministries_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_members: {
        Row: {
          id: string
          joined_at: string | null
          ministry_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          ministry_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          ministry_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ministry_members_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          ministry_id: string
          role_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          ministry_id: string
          role_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          ministry_id?: string
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_roles_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          church_id: string | null
          created_at: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          church_id?: string | null
          created_at?: string | null
          id: string
          name: string
          phone?: string | null
          photo_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          event_id: string
          id: string
          ministry_id: string
          notes: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string | null
          event_id: string
          id?: string
          ministry_id: string
          notes?: string | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string | null
          event_id?: string
          id?: string
          ministry_id?: string
          notes?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      song_history: {
        Row: {
          event_id: string | null
          id: string
          key_used: string | null
          played_at: string | null
          song_id: string | null
          worship_set_id: string | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          key_used?: string | null
          played_at?: string | null
          song_id?: string | null
          worship_set_id?: string | null
        }
        Update: {
          event_id?: string | null
          id?: string
          key_used?: string | null
          played_at?: string | null
          song_id?: string | null
          worship_set_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "song_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_history_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_history_worship_set_id_fkey"
            columns: ["worship_set_id"]
            isOneToOne: false
            referencedRelation: "worship_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          artist: string | null
          bpm: number | null
          chords: string | null
          church_id: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          lyrics: string | null
          original_key: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          artist?: string | null
          bpm?: number | null
          chords?: string | null
          church_id: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lyrics?: string | null
          original_key?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          artist?: string | null
          bpm?: number | null
          chords?: string | null
          church_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lyrics?: string | null
          original_key?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transaction_attachments: {
        Row: {
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          transaction_id: string
          uploaded_at: string | null
        }
        Insert: {
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          transaction_id: string
          uploaded_at?: string | null
        }
        Update: {
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          transaction_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_attachments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
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
      worship_sets: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string | null
          event_id: string | null
          id: string
          notes: string | null
          songs_order: Json | null
          status: string | null
          title: string
          total_duration: number | null
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          songs_order?: Json | null
          status?: string | null
          title: string
          total_duration?: number | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          songs_order?: Json | null
          status?: string | null
          title?: string
          total_duration?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worship_sets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_church_stats: {
        Args: { _church_id: string; _stat_date: string }
        Returns: undefined
      }
      check_schedule_conflicts: {
        Args: {
          _event_date: string
          _exclude_event_id?: string
          _user_id: string
        }
        Returns: {
          conflict_event_date: string
          conflict_event_id: string
          conflict_event_title: string
          conflict_role: string
        }[]
      }
      get_user_church_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "PASTOR" | "LEADER" | "MINISTER" | "MEMBER" | "VISITOR"
      payment_type: "UNICO" | "PARCELADO" | "RECORRENTE"
      transaction_status: "PAID" | "PENDING" | "OVERDUE" | "CANCELLED"
      transaction_type: "INCOME" | "EXPENSE"
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
      app_role: ["PASTOR", "LEADER", "MINISTER", "MEMBER", "VISITOR"],
      payment_type: ["UNICO", "PARCELADO", "RECORRENTE"],
      transaction_status: ["PAID", "PENDING", "OVERDUE", "CANCELLED"],
      transaction_type: ["INCOME", "EXPENSE"],
    },
  },
} as const
