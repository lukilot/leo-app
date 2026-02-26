"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import LEOMap from "@/components/LEOMap";
import PlanBModal, { PlanBOption } from "@/components/PlanBModal";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, GripVertical, MapPin, Clock, CheckCircle2,
    Loader2, Navigation as NavigationIcon, AlertTriangle, Zap, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PackageStop {
    id: string;
    tracking_number: string;
    recipient_address: string;
    recipient_name: string;
    status: string;
    window_start: string | null;
    window_end: string | null;
    sequence_number: number;
    geo_lat: number | null;
    geo_lng: number | null;
    current_plan_b: string | null;
}

function SortableStop({
    stop,
    index,
    isActive
}: {
    stop: PackageStop;
    index: number;
    isActive: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: stop.id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : undefined
    };

    const windowStart = stop.window_start ? new Date(stop.window_start) : null;
    const windowEnd = stop.window_end ? new Date(stop.window_end) : null;
    const pad = (n: number) => n.toString().padStart(2, "0");
    const fmt = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all",
                isDragging
                    ? "bg-black text-white border-black shadow-2xl scale-[1.02]"
                    : isActive
                        ? "bg-white border-leo-primary shadow-lg"
                        : stop.status === "delivered"
                            ? "bg-gray-50 border-gray-100 opacity-50"
                            : "bg-white border-gray-100 shadow-sm hover:border-gray-300"
            )}
        >
            {/* Sequence badge */}
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-black",
                isDragging ? "bg-white/10 text-white" : isActive ? "bg-black text-leo-primary" : "bg-gray-50 text-gray-500"
            )}>
                {stop.status === "delivered" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : index + 1}
            </div>

            {/* Stop info */}
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "text-[14px] font-black leading-none truncate",
                    isDragging ? "text-white" : "text-black"
                )}>
                    {stop.recipient_address.split(",")[0]}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    {windowStart && windowEnd ? (
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            isDragging ? "text-white/60" : isActive ? "text-leo-primary" : "text-gray-400"
                        )}>
                            {fmt(windowStart)} – {fmt(windowEnd)}
                        </span>
                    ) : (
                        <span className="text-[10px] text-gray-300 font-black uppercase">TBD</span>
                    )}
                    {stop.current_plan_b && (
                        <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">
                            Plan B
                        </span>
                    )}
                </div>
            </div>

            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "cursor-grab active:cursor-grabbing p-2 rounded-xl",
                    isDragging ? "text-white/60" : "text-gray-300 hover:text-gray-500"
                )}
            >
                <GripVertical className="w-5 h-5" />
            </div>
        </div>
    );
}

export default function CourierRoutePage() {
    const [stops, setStops] = useState<PackageStop[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<"list" | "map">("list");
    const [showPlanB, setShowPlanB] = useState(false);
    const [selectedStop, setSelectedStop] = useState<PackageStop | null>(null);
    const [recalculating, setRecalculating] = useState(false);
    const [activeStopId, setActiveStopId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const fetchStops = useCallback(async () => {
        const { data } = await supabase
            .from("packages")
            .select("id, tracking_number, recipient_address, recipient_name, status, window_start, window_end, sequence_number, geo_lat, geo_lng, current_plan_b")
            .not("status", "in", '("returned","exception")')
            .order("sequence_number", { ascending: true });

        if (data) setStops(data as PackageStop[]);
        setLoading(false);

        // Mark first non-delivered stop as active
        const firstActive = data?.find(p => p.status !== "delivered");
        if (firstActive) setActiveStopId(firstActive.id);
    }, []);

    useEffect(() => {
        fetchStops();
    }, [fetchStops]);

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = stops.findIndex(s => s.id === active.id);
        const newIndex = stops.findIndex(s => s.id === over.id);
        const newOrder = arrayMove(stops, oldIndex, newIndex);
        setStops(newOrder);

        // Recalculate windows after manual reorder
        setRecalculating(true);
        try {
            await supabase.from("package_events").insert(
                newOrder.map((stop, i) => ({
                    package_id: stop.id,
                    event_type: "sequence_changed",
                    payload: { new_sequence: i + 1 }
                }))
            );
            await Promise.all(
                newOrder.map((stop, i) =>
                    supabase.from("packages").update({ sequence_number: i + 1 }).eq("id", stop.id)
                )
            );
        } finally {
            setRecalculating(false);
        }
    }

    async function handlePlanB(planB: PlanBOption, meta?: Record<string, string>) {
        if (!selectedStop) return;
        await fetch(`/api/packages/${selectedStop.id}/plan-b`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planB, meta, triggeredBy: "courier" })
        });
        fetchStops();
    }

    const mapMarkers = stops
        .filter(s => s.geo_lat && s.geo_lng)
        .map((s, i) => ({
            id: s.id,
            latitude: s.geo_lat!,
            longitude: s.geo_lng!,
            label: s.recipient_address.split(",")[0],
            type: "stop" as const
        }));

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-leo-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F4] font-sans pb-32">
            {/* Header */}
            <header className="px-6 pt-16 pb-6 bg-black text-white flex items-center gap-4">
                <Link href="/courier/day">
                    <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-[20px] font-black italic tracking-tighter uppercase leading-none">
                        Moja <span className="text-leo-primary">Trasa</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stops.length} Stopów</span>
                        {recalculating && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-leo-primary uppercase">
                                <Loader2 className="w-3 h-3 animate-spin" /> Przeliczam okna...
                            </span>
                        )}
                    </div>
                </div>
                <Link href={`/courier/stop/${activeStopId}`}>
                    <Button className="h-12 bg-leo-primary text-black font-black uppercase tracking-widest text-[11px] px-5 rounded-2xl border-0 flex items-center gap-2">
                        <NavigationIcon className="w-4 h-4" />
                        Nawiguj
                    </Button>
                </Link>
            </header>

            {/* Toggle */}
            <div className="px-6 py-4">
                <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
                    {[
                        { id: "list", label: "Lista Stopów" },
                        { id: "map", label: "Widok Mapy" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id as "list" | "map")}
                            className={cn(
                                "flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                activeView === tab.id ? "bg-black text-white" : "text-gray-400"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-6">
                {activeView === "list" ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                                    Przytrzymaj i przeciągnij, aby zmienić kolejność
                                </p>
                                {stops.map((stop, i) => (
                                    <div key={stop.id} className="relative group">
                                        <SortableStop stop={stop} index={i} isActive={stop.id === activeStopId} />
                                        <button
                                            onClick={() => { setSelectedStop(stop); setShowPlanB(true); }}
                                            className="absolute right-16 top-1/2 -translate-y-1/2 h-8 px-3 bg-amber-100 text-amber-700 rounded-xl text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            Plan B
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                        <LEOMap
                            theme="tactical"
                            markers={mapMarkers}
                            initialViewState={{ latitude: 52.23, longitude: 21.01, zoom: 12 }}
                        />
                    </div>
                )}
            </div>

            <PlanBModal
                isOpen={showPlanB}
                onClose={() => setShowPlanB(false)}
                onConfirm={handlePlanB}
                packageId={selectedStop?.id}
                mode="courier"
            />
        </div>
    );
}
