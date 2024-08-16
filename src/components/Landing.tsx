import { Button } from '@/components/ui/button';
import Appbar from '../utility-components/Appbar';
import { useNavigate } from 'react-router-dom';
import { SvgSquares } from './ui/svg-elements';

const Landing = () => {
  const navigate = useNavigate();

  const handleButtonForReading = () => {
    navigate('/feed')
  }
  
  return (
    <div className="bg-tgreen h-full w-full">
      <div>
        <Appbar></Appbar>
      </div>

      <div className="text-night sm:max-md:grid grid-cols-2 gap-4 place-content-around h-screen ">

          {/* body  */}
        <div className='flex justify-between '>

          {/* body text title */}
          <div className='text-center md:text-left sm:p-20 lg:pl-16 '>

            <div className='md:flex lg:mb-4 '> 

              <div className="text-5xl lg:text-7xl text-wrap ">
                Share your 
              </div>
              <div className='text-5xl lg:text-7xl font-semibold mb-2 md:pl-3 lg:pl-5'>
                knowledge
              </div>

            </div>

            {/* body text description  */}
            <div>

              <div className= "text-xl md:text-xl lg:text-5xl text-wrap lg:mb-8">
                Discover stories, thinking, and expertise from writers on any topic.
              </div>

                {/* button  */}
              <div className='text-center md:text-left'>
                <Button className="rounded-full mt-2 lg:px-8 lg:py-5 lg:text-lg" onClick={handleButtonForReading}>Show me</Button>
              </div>
              
            </div>

          </div>

          {/* decoration  */}
          <div className='mt-12 hidden lg:block'>
            <SvgSquares />
          </div>

        </div>

        {/* footer  */}
        <div className="absolute bottom-0 bg-night text-white w-full h-20 flex justify-center items-center">
          <div>
            <Button className="rounded-full bg-transparent hover:bg-night">Help</Button>
            <Button className="rounded-full bg-transparent hover:bg-night">Status</Button>
            <Button className="rounded-full bg-transparent hover:bg-night">About</Button>
            <Button className="rounded-full bg-transparent hover:bg-night">Blog</Button>
            <Button className="rounded-full bg-transparent hover:bg-night">Privacy</Button>
            <Button className="rounded-full bg-transparent hover:bg-night">Terms</Button>
          </div>
          <div className=' text-white text-xs'>
            @Tejas Bhoyar
          </div>
        </div>

      </div>
    </div >
  );
};

export default Landing;

// import { Button } from '@/components/ui/button';
// import Appbar from '../utility-components/Appbar';
// import { useNavigate } from 'react-router-dom';
// import { SvgSquares } from './ui/svg-elements';
// import { useDimensions } from '@/hooks/useDimensions';

// const Landing = () => {
//   const navigate = useNavigate();

//   const handleButtonForReading = () => {
//     navigate('/feed')
//   }
//   const isMobileView = useDimensions();
  
//   return (
//     <div>
//       <div className=''>
//         <Appbar></Appbar>
//       </div>

//       <div className="relative bg-tgreen text-night h-screen">

//         <div className='md:pt-36 flex justify-between'>

//           {/* body  */}
//           <div className='pl-16'>

//             <div className="text-8xl font-sans mb-2">Share your knowledge</div>

//             <div>
//               <div className="text-5xl text-wrap ">
//                 Discover stories, thinking, and expertise from writers on any topic.

//               </div>
//               <div>
//                 <Button className="rounded-full mt-2 text-lg" onClick={handleButtonForReading}>Show me</Button>
//               </div>
//             </div>
//           </div>

//           {/* Decoration  */}
//           {isMobileView ? (
//             <div />
//           ) : (
//             <div className='mt-7'>
//               <SvgSquares />
//             </div>
//           )}

//         </div>

//         {/* footer  */}
//         <div className="absolute bottom-0 bg-night text-white w-full h-20 flex justify-center items-center">
//           <div>
//             <Button className="rounded-full bg-transparent hover:bg-night">Help</Button>
//             <Button className="rounded-full bg-transparent hover:bg-night">Status</Button>
//             <Button className="rounded-full bg-transparent hover:bg-night">About</Button>
//             <Button className="rounded-full bg-transparent hover:bg-night">Blog</Button>
//             <Button className="rounded-full bg-transparent hover:bg-night">Privacy</Button>
//             <Button className="rounded-full bg-transparent hover:bg-night">Terms</Button>
//           </div>
//           <div className=' text-white text-xs'>
//             @Tejas Bhoyar
//           </div>
//         </div>

//       </div>
//     </div >
//   );
// };

// export default Landing;
