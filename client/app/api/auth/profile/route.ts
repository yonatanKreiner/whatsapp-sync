import { config } from './../../../../middleware';
import { NextRequest, NextResponse } from 'next/server'
import {JwtPayload, verify} from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config';

export async function GET(request: NextRequest) {
    const profile = request.cookies.get("profile")?.value;

    if(!profile){
        return NextResponse.json('not authenticated', {status: 401});
    }
    
    const profileObject = verify(profile, JWT_SECRET);

    const res = NextResponse.json((profileObject as JwtPayload).profile, { status: 200, });

    return res;
}