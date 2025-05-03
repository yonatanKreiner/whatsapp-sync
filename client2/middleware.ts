import { jwtVerify } from 'jose';
import { JWT_SECRET } from './src/app/config';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const profile = request.cookies.get("profile")?.value;

    if (!profile) {
        return NextResponse.json('not authenticated', { status: 401 });
    }

    const secret = new TextEncoder().encode(
        JWT_SECRET,
    );

    try {
        await jwtVerify(profile, secret);
    } catch (err) {
        return NextResponse.json('token coudlnt verify', { status: 401 });
    }

    const next = NextResponse.next();

    return next;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/api/people/read:path*',
        '/api/people/update:path*'
    ],
}