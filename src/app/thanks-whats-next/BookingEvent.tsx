'use client';import {useEffect} from 'react';import {track} from '@/lib/analytics';export function BookingEvent(){useEffect(()=>track('booking_completed',{page:'thanks-whats-next'}),[]);return null}
