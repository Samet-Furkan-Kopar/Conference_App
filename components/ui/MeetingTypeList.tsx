"use client";
import Image from "next/image";
import HomeCard from "./HomeCard";
import { useState } from "react";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"

const MeetingTypeList = () => {
    const [meetingState, setMeetingState]= useState<'isScheduleMeeting'|'isJoiningMeeting'|'isInstantMeeting'|undefined>()
    const [values, setvalues] = useState({
        dateTime: new Date(),
        description:"",
        link:""
    })
    const [callDetails, setcallDetails] = useState<Call>()

    const router = useRouter();
    const {user} = useUser();
    const client = useStreamVideoClient();
    const { toast } = useToast()

    const createMeeting = async() => {
        if (!client || !user) return;

        try {
            if(!values.dateTime){
                toast({title: "Please select a date and time"})
                  return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if(!call) throw new Error('Failed t create call')

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant meeting";
            await call.getOrCreate({
               data: {
                starts_at: startsAt,
                custom: {
                    description,
                },
                },
            });
            setcallDetails(call);
            if(!values.description){
                router.push(`/meeting/${call.id}`);
            }
            toast({title: "Meeting Created"})
        } catch (error) {
            toast({
                title: "Failed to create meeting",
              })
        }
    }
    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard 
            img="/icons/add-meeting.svg"
            title="New Meeting"
            description="Start an istant meeting"
            handleClick={() => {setMeetingState('isInstantMeeting')}}
            className="bg-orange-1"
            />
            <HomeCard 
            img="/icons/schedule.svg"
            title="Schedule Meeting"
            description="Plan your meeting"
            handleClick={() => {setMeetingState('isJoiningMeeting')}}
            className="bg-blue-1"
            />
            <HomeCard 
            img="/icons/recordings.svg"
            title="View Recordings"
            description="Check out your recordings"
            handleClick={() => {setMeetingState('isScheduleMeeting')}}
            className="bg-purple-1"
            />
            <HomeCard 
            img="/icons/join-meeting.svg"
            title="Join Meeting"
            description="Via invitation link"
            handleClick={() => {setMeetingState('isInstantMeeting')}}
            className="bg-yellow-1"
            />

            <MeetingModal
            isOpen = { meetingState === "isInstantMeeting"}
            onClose = {() => setMeetingState(undefined)}
            title = "Start an Instant Meeting" 
            className="text-center"
            buttonText = "Start Meeting"
            handleClick={createMeeting}
            />
        </section>
    );
};

export default MeetingTypeList;