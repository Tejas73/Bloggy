import { Button } from '@/components/ui/button';
import Appbar from '../utility-components/Appbar';
import { useNavigate } from 'react-router-dom';

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
        <div>
          <div className="text-7xl font-sans">Share your knowledge</div>
          <div className="text-3xl">
            Discover stories, thinking, and expertise from writers on any topic.
            <div>
              <Button className="rounded-full" onClick={handleButtonForReading}>Start reading</Button>
            </div>
          </div>
        </div>

        {/* buttons  */}
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
