import { Button } from '@/components/ui/button';
import Appbar from '../utility-components/Appbar';
import { useNavigate } from 'react-router-dom';
import { SvgSquares } from './ui/svg-elements';

//improve UI

const Landing = () => {
  const navigate = useNavigate()
  const handleButtonForReading = () => {
    navigate('/feed')
  }

  return (
    <div>

      <Appbar></Appbar>

      <div className="relative h-sc bg-tgreen text-night h-screen">

        <div className='pt-36 flex justify-between'>

          {/* body  */}
          <div className=' pl-16'>
            <div className="text-8xl font-sans mb-2">Share your knowledge</div>
            {/* <div className="text-8xl font-sans">knowledge</div> */}

            <div>
              <div  className="text-5xl text-wrap ">
                Discover stories, thinking, and expertise from writers on any topic.

              </div>
              <div>
                <Button className="rounded-full mt-2 text-lg" onClick={handleButtonForReading}>Show me</Button>
              </div>
            </div>
          </div>

          {/* svg  */}
          <div className=' mt-7'>
            <SvgSquares></SvgSquares>
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
    </div>
  );
};

export default Landing;
