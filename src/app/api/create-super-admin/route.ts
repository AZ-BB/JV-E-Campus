import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/schema';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'ADMIN',
        full_name: 'Super Admin'
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user?.id;

    try {
      // 2. Insert into internal DB
      await db.insert(users).values({
        fullName: 'Super Admin',
        email,
        role: 'ADMIN',
        authUserId: userId,
        language: 'en',
        profilePictureUrl: '',
        createdBy: null,
        createdAt: new Date().toISOString()
      });
    } catch (dbError) {
      // ⚠️ Rollback Supabase user if DB insert fails
      if (userId) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      }
      throw dbError;
    }

    return NextResponse.json({ user: data.user }, { status: 200 });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
