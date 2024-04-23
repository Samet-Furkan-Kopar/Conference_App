import { cn } from "@/lib/utils";
import {
    CallControls,
    CallParticipantsList,
    CallStatsButton,
    PaginatedGridLayout,
    SpeakerLayout,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import EndCallButton from "../EndCallButton";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
    const [layout, setlayout] = useState<CallLayoutType>("speaker-left");
    const [showParticipants, setshowParticipants] = useState(false);
    const searchParams = useSearchParams()
    const isPersonelRoom = !!searchParams.get('personalRoom')
    const CallLayout = () => {
        switch (layout) {
            case "grid":
                return <PaginatedGridLayout />;
            case "speaker-right":
                return <SpeakerLayout participantsBarPosition={"left"} />;
            default:
                return <SpeakerLayout participantsBarPosition={"right"} />;
                break;
        }
    };
    return (
        <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
            <div className="relative flex size-full items-center justify-center">
                <div className="flex size-full max-w-[1000px] items-center">
                    <CallLayout />
                </div>
                <div
                    className={cn("h-[calc(100vh-86px)] hidden ml-2", {
                        "show-block": showParticipants,
                    })}
                >
                    <CallParticipantsList onClose={() => setshowParticipants(false)} />
                </div>
            </div>
            <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
                <CallControls />

                <DropdownMenu>
                    <DropdownMenuTrigger
                    className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                        <LayoutList size={20} className="text-white"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item,index) => (
                            <div key={index}>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setlayout(item.toLowerCase() as CallLayoutType)}>
                                   {item}
                                </DropdownMenuItem>
                            </div>    
                            ))
                            }
                        <DropdownMenuSeparator className="border-dark-1"/>
                    </DropdownMenuContent>
                </DropdownMenu>
                <CallStatsButton />
                <button className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]" onClick={()=>setshowParticipants((prev)=>!prev)}>
                        <Users size={20} className="text-white"/>
                </button>
                {!isPersonelRoom && <EndCallButton/>}
            </div>
        </section>
    );
};

export default MeetingRoom;
