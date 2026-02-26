"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

interface RealtimeContextValue {
    subscribeToPackageEvents: (packageId: string, callback: (event: any) => void) => () => void;
    subscribeToCourierLocation: (courierId: string, callback: (loc: any) => void) => () => void;
    subscribeToExceptions: (callback: (exception: any) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function useRealtime() {
    const ctx = useContext(RealtimeContext);
    if (!ctx) throw new Error("useRealtime must be used within RealtimeProvider");
    return ctx;
}

export default function RealtimeProvider({ children }: { children: ReactNode }) {
    const channels = useRef<RealtimeChannel[]>([]);

    const cleanup = () => {
        channels.current.forEach(ch => supabase.removeChannel(ch));
        channels.current = [];
    };

    useEffect(() => {
        return cleanup;
    }, []);

    /**
     * Subscribe to all events for a specific package.
     * Used by: Customer live tracking, Dispatcher exception panel.
     */
    const subscribeToPackageEvents = (packageId: string, callback: (event: any) => void) => {
        const channel = supabase
            .channel(`package-events-${packageId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "package_events",
                    filter: `package_id=eq.${packageId}`
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .subscribe();

        channels.current.push(channel);

        return () => {
            supabase.removeChannel(channel);
            channels.current = channels.current.filter(c => c !== channel);
        };
    };

    /**
     * Subscribe to live courier GPS location updates.
     * Used by: Customer live tracking (only during near_delivery/at_door).
     */
    const subscribeToCourierLocation = (courierId: string, callback: (loc: any) => void) => {
        const channel = supabase
            .channel(`courier-location-${courierId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "courier_locations",
                    filter: `courier_id=eq.${courierId}`
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .subscribe();

        channels.current.push(channel);

        return () => {
            supabase.removeChannel(channel);
            channels.current = channels.current.filter(c => c !== channel);
        };
    };

    /**
     * Subscribe to all open exceptions.
     * Used by: Dispatcher panel for real-time exception queue.
     */
    const subscribeToExceptions = (callback: (exception: any) => void) => {
        const channel = supabase
            .channel("exceptions-feed")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "exceptions"
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "exceptions"
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .subscribe();

        channels.current.push(channel);

        return () => {
            supabase.removeChannel(channel);
            channels.current = channels.current.filter(c => c !== channel);
        };
    };

    return (
        <RealtimeContext.Provider value={{
            subscribeToPackageEvents,
            subscribeToCourierLocation,
            subscribeToExceptions
        }}>
            {children}
        </RealtimeContext.Provider>
    );
}
