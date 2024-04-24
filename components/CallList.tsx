"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./ui/Loader";
import { useToast } from "./ui/use-toast";

interface CallListProps {
    type: "ended" | "upcoming" | "recordings";
}

const CallList = ({ type }: CallListProps) => {
    const [recordings, setRecordings] = useState<CallRecording[]>([]);
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();

    const { toast } = useToast()
    const router = useRouter();

    const getCalls = () => {
        switch (type) {
            case "ended":
                return endedCalls;
            case "upcoming":
                return upcomingCalls;
            case "recordings":
                return recordings;
            default:
                return [];
        }
    };
    const getNoCallsMessage = () => {
        switch (type) {
            case "ended":
                return "No Previous Calls";
            case "upcoming":
                return "No Upcoming Calls";
            case "recordings":
                return "No Recordings";
            default:
                return "";
        }
    };

    // useEffect(() => {
    //     try {
    //         const fetchRecordings = async () => {
    //             const callData = await Promise.all(
    //                 callRecordings.map((meeting) => meeting.queryRecordings()) ?? []
    //             ); // sonucunun null veya undefined olup olmadığını kontrol eder. Eğer bu ifade null veya undefined ise, Promise.all() fonksiyonuna boş bir dizi geçirir.
    
    //             // [[1], [4], [9], [16], [25]] map
    //             // [1, 4, 9, 16, 25] flatMap
    
    //             const recording = callData
    //                 .filter((call) => call.recordings.length > 0)
    //                 .flatMap((call) => call.recordings);
    //             setRecordings(recording);
    //         };
    //         if (type === "recordings") {
    //             fetchRecordings();
    //         }
    //     } catch (error) {
    //         toast({ title : "Try Later Again"})
    //     }

        
    // }, [type, callRecordings]);


    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(
                    callRecordings.map((meeting) => meeting.queryRecordings())
                );
    
                const recording = callData
                    .filter((call) => call.recordings.length > 0)
                    .flatMap((call) => call.recordings);
                setRecordings(recording);
            } catch (error) {
                toast({ title: "Try Again Later" });
            }
        };
    
        if (type === "recordings") {
            fetchRecordings();
        }
    }, [type, callRecordings]);
    
    if (isLoading) return <Loader />;

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();


    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording) => (
                    <MeetingCard
                        key={(meeting as Call).id}
                        icon={
                            type === "ended"
                                ? "/icons/previous.svg"
                                : type === "upcoming"
                                ? "/icons/upcoming.svg"
                                : "/icons/recordings.svg"
                        }
                        title={
                            (meeting as Call).state?.custom?.description ||
                            (meeting as CallRecording).filename?.substring(0, 26) ||
                            "No Description"
                        }
                        date={
                            (meeting as Call).state?.startsAt?.toLocaleString() ||
                            (meeting as CallRecording).start_time?.toLocaleString()
                        }
                        isPreviousMeeting={type === "ended"}
                        link={
                            type === "recordings"
                                ? (meeting as CallRecording).url
                                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                                      (meeting as Call).id
                                  }`
                        }
                        buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
                        buttonText={type === "recordings" ? "Play" : "Start"}
                        handleClick={
                            type === "recordings"
                                ? () => router.push(`${(meeting as CallRecording).url}`)
                                : () => router.push(`/meeting/${(meeting as Call).id}`)
                        }
                    />
                ))
            ) : (
                <h1>{noCallsMessage}</h1>
            )}
        </div>
    );
};

export default CallList;
