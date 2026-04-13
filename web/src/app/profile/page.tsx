"use client";
import { SignOutButton } from "@clerk/nextjs";
import PetCard from "@/components/pets/PetCard";
import Link from "next/link";

type Pet = {
    id: string;
    name: string;
    breed: string;
    species: "dog" | "cat";
};

function Profile (){
    const pets: Pet[] = [
        {
            id: "1",
            name: "Buddy",
            breed: "Golden Retriever",
            species: "dog",
        },
        {
            id: "2",
            name: "Whiskers",
            breed: "Siamese",
            species: "cat",
        }
    ]
    return(
        <>
            {/* Wrapper */}
            <main className = "min-h-screen bg-[#FDF6EE] lg:px-8 lg:py-6">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[320px_1fr] lg:items-start">
                    {/* inter-wrapper 1 */}
                    <div>
                        <div className ="flex flex-col bg-white pt-6 lg:rounded-2xl lg:p-6">
                            {/* Avator section  */}
                            <div className = "flex flex-col items-center justify-center">
                                {/* Avator image or profile */}
                                <div className = "rounded-full h-20 w-20 text-white text-2xl text-bold bg-[#E8734A] flex items-center justify-center">
                                    S   
                                </div>
                                {/* Username */}
                                <h2 className = "mt-3 text-xl font-bold text-[#1A1A2E]">Sarah Johnson</h2>
                                <h1 className ="text-sm text-gray-600">Upper West Side, New York</h1>
                                <button className="mt-3 bg-white text-[#FF6B6B] border-2 border-[#FF6B6B] rounded-[10px] px-5 py-2 text-[13px] font-semibold cursor-pointer">
                                    Edit Profile
                                </button>
                            </div>  
                        </div>
                        <div className="lg:mt-4 lg:rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                            {/* Highlight or stats */}
                            <div className = "grid grid-cols-3 gap-4 text-center items-center justify-center">
                                {/* statcards */}
                                {/* Amount of pets */}
                                <div className = "rounded-xl border border-[#E8DDD0] p-3">
                                    <h2 className = "text-[#FF6B6B] font-bold text-2xl">2</h2>
                                    <span className="text-gray-600">Pets</span>
                                </div>
                                {/* Amount of matches */}
                                <div className = "rounded-xl border border-[#E8DDD0] p-3">
                                    <h2 className = "text-[#FF6B6B] font-bold text-2xl">3</h2>
                                    <span className="text-gray-600">Matches</span>
                                </div>
                                {/* Amount of events */}
                                <div className = "rounded-xl border border-[#E8DDD0] p-3">
                                    <h2 className = "text-[#FF6B6B] font-bold text-2xl">5</h2>
                                    <span className="text-gray-600">Events</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* inter-wrapper 2 */}
                    <div className ="px-4 pb-6">
                        {/* Pet card display section */}
                        <section className="mt-6">
                            <h2 className="mb-3 text-base font-semibold text-gray-900">My Pets</h2>
                            <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row">
                                {pets.map((pet) =>{
                                    return(
                                    // Pet card
                                    <div key = {pet.id} className="relative w-fit">
                                        <PetCard name= {pet.name} breed= {pet.breed} species={pet.species} />
                                        <Link
                                            href="/profile/edit-pet/123"
                                            className="absolute right-3 top-3 text-xs font-medium text-orange-500 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                    )
                                })}
                            </div>
                        </section>
                        {/* Sign Out */}
                        <div className="flex justify-center pt-4 w-full lg:hidden">
                            <SignOutButton>
                                <button className = "w-full rounded-lg p-3 border-2 border-[#E5E7EB] text-[#6B7280]">
                                    Sign Out
                                </button>
                            </SignOutButton>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )

}
export default Profile;