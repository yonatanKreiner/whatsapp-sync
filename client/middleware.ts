import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { JWT_SECRET } from './app/config';

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