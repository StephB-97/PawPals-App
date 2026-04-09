"use client";
import { SignOutButton } from "@clerk/nextjs";
import PetCard from "@/components/pets/PetCard";
import Link from "next/link";

function Profile (){
    return(
        <>
            {/* Wrapper */}
            <main className = "min-h-screen bg-[#FDF6EE] px-4 py-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[320px_1fr] lg:items-start">
                    {/* inter-wrapper 1 */}
                    <div>
                        {/* Avator section  */}
                        <div className = "flex flex-col items-center justify-center">
                            {/* Avator image or profile */}
                            <div className = "rounded-full h-20 w-20 text-white text-2xl text-bold bg-[#E8734A] flex items-center justify-center">
                                S
                            </div>
                            {/* Username */}
                            <h2 className = "mt-3 text-xl font-bold">Sarah Johnson</h2>
                            <h1 className ="text-sm text-gray-600">Upper West Side, New York</h1>
                            <button className="mt-3 py-3 px-5 border border-[#E8734A] bg-[white] text-[#1A1A2E] rounded-lg cursor-pointer text-[#1A1A2E] font-semibold lg:block">
                                Edit Profile
                            </button>
                        </div>
                        {/* Highlight or stats */}
                        <div className = "mt-4 grid grid-cols-3 gap-4 text-center">
                            {/* statcards */}
                            {/* Amount of pets */}
                            <div className = "rounded-xl border border-[#E8DDD0] p-3">
                                <h2>2</h2>
                                <span>Pets</span>
                            </div>
                            {/* Amount of matches */}
                            <div className = "rounded-xl border border-[#E8DDD0] p-3">
                                <h2>3</h2>
                                <span>Matches</span>
                            </div>
                            {/* Amount of events */}
                            <div className = "rounded-xl border border-[#E8DDD0] p-3">
                                <h2>5</h2>
                                <span>Events</span>
                            </div>
                        </div>
                    </div>
                    {/* inter-wrapper 2 */}
                    <div>
                        {/* Pet card display section */}
                        <section className="mt-6">
                            <h2 className="mb-3 text-base font-semibold text-gray-900">My Pets</h2>
                            <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row">
                                <div className="relative w-fit">
                                <PetCard name="Buddy" breed="Golden Retriever" species="dog" />
                                <Link
                                    href="/profile/edit-pet/123"
                                    className="absolute right-3 top-3 text-xs font-medium text-orange-500 hover:underline"
                                >
                                    Edit
                                </Link>
                                </div>

                                <div className="relative w-fit">
                                <PetCard name="Whiskers" breed="Siamese" species="cat" />
                                <Link
                                    href="/profile/edit-pet/123"
                                    className="absolute right-3 top-3 text-xs font-medium text-orange-500 hover:underline"
                                >
                                    Edit
                                </Link>
                                </div>
                            </div>
                        </section>
                        {/* Sign Out */}
                        <div className="flex justify-center pt-4 w-full lg:hidden">
                            <SignOutButton>
                                <button className = "w-full rounded-lg p-3 border-2 border-[#E5E7EB]">
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