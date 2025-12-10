export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      app_settings: {
        Row: {
          close_at: string | null;
          created_at: string | null;
          id: number;
          open_at: string;
          updated_at: string | null;
        };
        Insert: {
          close_at?: string | null;
          created_at?: string | null;
          id: number;
          open_at: string;
          updated_at?: string | null;
        };
        Update: {
          close_at?: string | null;
          created_at?: string | null;
          id?: number;
          open_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          is_anonymous: boolean | null;
          paper_id: string;
          writer_id: string;
          writer_name: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          paper_id: string;
          writer_id: string;
          writer_name?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          paper_id?: string;
          writer_id?: string;
          writer_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_paper_id_fkey';
            columns: ['paper_id'];
            isOneToOne: false;
            referencedRelation: 'papers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_writer_id_fkey';
            columns: ['writer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      paper_stickers: {
        Row: {
          created_at: string | null;
          id: string;
          paper_id: string;
          rotation: number | null;
          scale: number | null;
          sticker_type: string;
          x: number;
          y: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          paper_id: string;
          rotation?: number | null;
          scale?: number | null;
          sticker_type: string;
          x: number;
          y: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          paper_id?: string;
          rotation?: number | null;
          scale?: number | null;
          sticker_type?: string;
          x?: number;
          y?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'paper_stickers_paper_id_fkey';
            columns: ['paper_id'];
            isOneToOne: false;
            referencedRelation: 'papers';
            referencedColumns: ['id'];
          },
        ];
      };
      paper_styles: {
        Row: {
          created_at: string | null;
          extra: Json | null;
          font_family: string | null;
          id: string;
          note_color: string | null;
          paper_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          extra?: Json | null;
          font_family?: string | null;
          id?: string;
          note_color?: string | null;
          paper_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          extra?: Json | null;
          font_family?: string | null;
          id?: string;
          note_color?: string | null;
          paper_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'paper_styles_paper_id_fkey';
            columns: ['paper_id'];
            isOneToOne: false;
            referencedRelation: 'papers';
            referencedColumns: ['id'];
          },
        ];
      };
      papers: {
        Row: {
          bg_texture: string | null;
          created_at: string | null;
          id: string;
          is_published: boolean | null;
          owner_id: string;
          slug: string;
          theme: string | null;
          title: string;
        };
        Insert: {
          bg_texture?: string | null;
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          owner_id: string;
          slug: string;
          theme?: string | null;
          title: string;
        };
        Update: {
          bg_texture?: string | null;
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          owner_id?: string;
          slug?: string;
          theme?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'papers_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          display_name: string;
          id: string;
          intro: string | null;
          is_admin: boolean | null;
          is_owner: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          display_name: string;
          id: string;
          intro?: string | null;
          is_admin?: boolean | null;
          is_owner?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          display_name?: string;
          id?: string;
          intro?: string | null;
          is_admin?: boolean | null;
          is_owner?: boolean | null;
          updated_at?: string | null;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
