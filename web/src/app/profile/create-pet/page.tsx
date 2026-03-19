"use client";

function PetForm(){
   return(
       <>
           {/* Mobile view first */}
           {/* wrapper */}
           <main className = "min-h-screen bg-[#FDF6EE]">
                {/* Photo upload section */}
                <div className="flex items-center border-b border-[#E8DDD0] gap-[0.9rem] pt-12 px-5 pb-3">
                    <span className = "text-[1rem] text-[#1A1A2E] cursor-pointer">&larr;</span>
                    <span className = "text-[1rem] text-[#1A1A2E]">Add Pet</span>
                </div>
                <div className ="p-5">
                    <div className ="w-full h-[130px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl border-[#E8DDD0] ">
                        <span className ="text-3xl">📷</span>
                        <span className = "text-sm text-gray">Upload Photo</span>
                    </div>
                </div>
                {/* Container for input content */}
                <div>
                    {/* Name input */}
                    <div className = "flex flex-col">
                        <label htmlFor="">Name</label>
                        <input type="text" placeholder="Pet's name" />
                    </div>
                     {/* Species toggle */}
                    <div className = "flex flex-col">
                        <label htmlFor="">Species</label>
                        {/* Button wrapper */}
                        <div>
                            <button>🐕 Dog</button>
                            <button>🐱 Cat</button>
                        </div>
                    </div>
                    {/* Pet size's toggle */}
                    <div className = "flex flex-col">
                        <label htmlFor="">Size</label>
                        {/* Button wrapper */}
                        <div>
                            <button>S</button>
                            <button>M</button>
                            <button>L</button>   
                        </div>
                    </div>
                    {/* Temperament toggle*/}
                    <div className = "flex flex-col">
                        <label htmlFor="">Temperament</label>
                        {/* Button wrapper */}
                        <div>
                            {/* Clickable chips */}
                            <button>Friendly</button>
                            <button>Playful</button>
                            <button>Shy</button>
                            <button>Energetic</button>
                            <button>Calm</button>
                            <button>Curious</button>
                        </div>
                    </div>
                    {/* Ai section */}
                    <div>
                        {/* Generate Bio with AI" button */}
                        <button>Generate Bio with AI</button>
                        {/* Bio text area */}
                        <input type="text" name="" id="" />
                    </div>
                    <button>Save Pet</button>
                </div>

           </main>
       </>
   )
}
export default PetForm;