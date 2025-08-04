export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          points: number
          requirements: Json
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          points?: number
          requirements?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          points?: number
          requirements?: Json
          updated_at?: string
        }
        Relationships: []
      }
      bets: {
        Row: {
          amount: number
          created_at: string
          fight_id: string
          fighter_id: string
          id: string
          odds: number
          payout: number | null
          potential_payout: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          fight_id: string
          fighter_id: string
          id?: string
          odds: number
          payout?: number | null
          potential_payout: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          fight_id?: string
          fighter_id?: string
          id?: string
          odds?: number
          payout?: number | null
          potential_payout?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bets_fight_id_fkey"
            columns: ["fight_id"]
            isOneToOne: false
            referencedRelation: "fights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_fighter_id_fkey"
            columns: ["fighter_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      fighters: {
        Row: {
          abilities: string[] | null
          attack: number
          backstory: string | null
          created_at: string
          defense: number
          description: string | null
          health: number
          id: string
          image: string
          losses: number | null
          name: string
          special_move: string | null
          speed: number
          total_shares: number | null
          updated_at: string
          value_per_share: number | null
          wins: number | null
          world: string
        }
        Insert: {
          abilities?: string[] | null
          attack: number
          backstory?: string | null
          created_at?: string
          defense: number
          description?: string | null
          health: number
          id: string
          image: string
          losses?: number | null
          name: string
          special_move?: string | null
          speed: number
          total_shares?: number | null
          updated_at?: string
          value_per_share?: number | null
          wins?: number | null
          world: string
        }
        Update: {
          abilities?: string[] | null
          attack?: number
          backstory?: string | null
          created_at?: string
          defense?: number
          description?: string | null
          health?: number
          id?: string
          image?: string
          losses?: number | null
          name?: string
          special_move?: string | null
          speed?: number
          total_shares?: number | null
          updated_at?: string
          value_per_share?: number | null
          wins?: number | null
          world?: string
        }
        Relationships: []
      }
      fights: {
        Row: {
          completed_at: string | null
          created_at: string
          fight_type: string | null
          fighter1_id: string
          fighter2_id: string
          id: string
          max_betting_amount: number | null
          rules: Json | null
          scheduled_at: string | null
          started_at: string | null
          status: string
          total_pot: number | null
          tournament_id: string | null
          updated_at: string
          venue: string | null
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          fight_type?: string | null
          fighter1_id: string
          fighter2_id: string
          id?: string
          max_betting_amount?: number | null
          rules?: Json | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          total_pot?: number | null
          tournament_id?: string | null
          updated_at?: string
          venue?: string | null
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          fight_type?: string | null
          fighter1_id?: string
          fighter2_id?: string
          id?: string
          max_betting_amount?: number | null
          rules?: Json | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          total_pot?: number | null
          tournament_id?: string | null
          updated_at?: string
          venue?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fights_fighter1_id_fkey"
            columns: ["fighter1_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fights_fighter2_id_fkey"
            columns: ["fighter2_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fights_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fights_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banned_at: string | null
          banned_reason: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_active: boolean | null
          is_banned: boolean | null
          total_balance: number | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banned_at?: string | null
          banned_reason?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          is_banned?: boolean | null
          total_balance?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banned_at?: string | null
          banned_reason?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          is_banned?: boolean | null
          total_balance?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      tournament_matches: {
        Row: {
          created_at: string | null
          fight_id: string | null
          id: string
          match_number: number
          next_match_id: string | null
          round_number: number
          status: string | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fight_id?: string | null
          id?: string
          match_number: number
          next_match_id?: string | null
          round_number: number
          status?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fight_id?: string | null
          id?: string
          match_number?: number
          next_match_id?: string | null
          round_number?: number
          status?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_matches_fight_id_fkey"
            columns: ["fight_id"]
            isOneToOne: false
            referencedRelation: "fights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_next_match_id_fkey"
            columns: ["next_match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_participants: {
        Row: {
          created_at: string | null
          eliminated_round: number | null
          fighter_id: string | null
          id: string
          is_eliminated: boolean | null
          seed_number: number | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string | null
          eliminated_round?: number | null
          fighter_id?: string | null
          id?: string
          is_eliminated?: boolean | null
          seed_number?: number | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string | null
          eliminated_round?: number | null
          fighter_id?: string | null
          id?: string
          is_eliminated?: boolean | null
          seed_number?: number | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_fighter_id_fkey"
            columns: ["fighter_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          entry_fee: number | null
          id: string
          max_participants: number
          name: string
          prize_pool: number | null
          start_date: string | null
          status: string | null
          tournament_type: string | null
          updated_at: string | null
          winner_id: string | null
          world: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          max_participants?: number
          name: string
          prize_pool?: number | null
          start_date?: string | null
          status?: string | null
          tournament_type?: string | null
          updated_at?: string | null
          winner_id?: string | null
          world: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          max_participants?: number
          name?: string
          prize_pool?: number | null
          start_date?: string | null
          status?: string | null
          tournament_type?: string | null
          updated_at?: string | null
          winner_id?: string | null
          world?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          fighter_id: string | null
          id: string
          price_per_share: number | null
          shares: number | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          fighter_id?: string | null
          id?: string
          price_per_share?: number | null
          shares?: number | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          fighter_id?: string | null
          id?: string
          price_per_share?: number | null
          shares?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_fighter_id_fkey"
            columns: ["fighter_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          progress: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          progress?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          progress?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_fighters: {
        Row: {
          created_at: string
          fighter_id: string
          id: string
          shares: number
          total_investment: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fighter_id: string
          id?: string
          shares?: number
          total_investment?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fighter_id?: string
          id?: string
          shares?: number
          total_investment?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_fighters_fighter_id_fkey"
            columns: ["fighter_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reported_content_id: string | null
          reported_content_type: string
          reported_user_id: string | null
          reporter_id: string | null
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reported_content_id?: string | null
          reported_content_type: string
          reported_user_id?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reported_content_id?: string | null
          reported_content_type?: string
          reported_user_id?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_tournament_fighter: {
        Args: {
          _tournament_id: string
          _fighter_id: string
          _seed_number?: number
        }
        Returns: boolean
      }
      admin_advance_tournament_round: {
        Args: { _tournament_id: string; _current_round: number }
        Returns: boolean
      }
      admin_create_fight: {
        Args: {
          _fighter1_id: string
          _fighter2_id: string
          _fight_type?: string
          _scheduled_at?: string
          _venue?: string
          _max_betting_amount?: number
          _tournament_id?: string
          _rules?: Json
        }
        Returns: string
      }
      admin_create_fighter: {
        Args: {
          _id: string
          _name: string
          _world: string
          _image: string
          _attack: number
          _defense: number
          _speed: number
          _health: number
          _description?: string
          _backstory?: string
          _special_move?: string
          _abilities?: string[]
        }
        Returns: boolean
      }
      admin_create_tournament: {
        Args: {
          _name: string
          _description: string
          _world: string
          _tournament_type?: string
          _max_participants?: number
          _entry_fee?: number
          _prize_pool?: number
          _start_date?: string
        }
        Returns: string
      }
      admin_delete_fighter: {
        Args: { _fighter_id: string }
        Returns: boolean
      }
      admin_generate_tournament_bracket: {
        Args: { _tournament_id: string }
        Returns: boolean
      }
      admin_update_fight: {
        Args: { _fight_id: string; _winner_id?: string; _status?: string }
        Returns: boolean
      }
      admin_update_fighter: {
        Args: {
          _id: string
          _name: string
          _world: string
          _image: string
          _attack: number
          _defense: number
          _speed: number
          _health: number
          _description?: string
          _backstory?: string
          _special_move?: string
          _abilities?: string[]
        }
        Returns: boolean
      }
      check_user_achievements: {
        Args: { _user_id: string }
        Returns: {
          new_achievement_id: string
          achievement_name: string
        }[]
      }
      create_notification: {
        Args: {
          _user_id: string
          _type: string
          _title: string
          _message: string
          _data?: Json
        }
        Returns: string
      }
      get_admin_analytics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_all_users_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          username: string
          display_name: string
          avatar_url: string
          bio: string
          total_balance: number
          is_active: boolean
          is_banned: boolean
          banned_at: string
          banned_reason: string
          created_at: string
          updated_at: string
          user_role: Database["public"]["Enums"]["app_role"]
          email_confirmed_at: string
        }[]
      }
      get_tournament_bracket: {
        Args: { _tournament_id: string }
        Returns: Json
      }
      get_user_fight_history: {
        Args: { _user_id: string }
        Returns: {
          fight_id: string
          fighter1_name: string
          fighter2_name: string
          winner_name: string
          bet_amount: number
          bet_outcome: string
          payout: number
          fight_date: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_subscription: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      has_subscription_access: {
        Args: {
          _user_id: string
          _required_tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Returns: boolean
      }
      update_user_role: {
        Args: {
          _user_id: string
          _new_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_user_status: {
        Args: { _user_id: string; _is_banned: boolean; _ban_reason?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "super_admin"
      subscription_tier: "free" | "fractional" | "premium"
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
      app_role: ["user", "admin", "super_admin"],
      subscription_tier: ["free", "fractional", "premium"],
    },
  },
} as const
