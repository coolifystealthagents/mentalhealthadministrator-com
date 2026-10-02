import {NextResponse} from 'next/server';export function GET(){return NextResponse.json({ok:true,service:'mental-health-administrator',mode:process.env.DEPLOYMENT_MODE||'preview'});}
