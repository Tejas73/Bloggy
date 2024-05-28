import { Button } from '@/components/ui/button';
import Appbar from './Appbar';

const Landing = () => {
  return (
    <div>
      <Appbar></Appbar>
      <div className="relative h-sc bg-tgreen text-night h-screen">
        <div>
          <div className="text-7xl font-sans">Share your knowledge</div>
          <div className="text-3xl">
            Discover stories, thinking, and expertise from writers on any topic.
            <div>
              <Button className="rounded-full">Start reading</Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 bg-night text-white w-full h-20 flex justify-center items-center">
          <Button className="rounded-full bg-transparent hover:bg-night">Help</Button>
          <Button className="rounded-full bg-transparent hover:bg-night">Status</Button>
          <Button className="rounded-full bg-transparent hover:bg-night">About</Button>
          <Button className="rounded-full bg-transparent hover:bg-night">Blog</Button>
          <Button className="rounded-full bg-transparent hover:bg-night">Privacy</Button>
          <Button className="rounded-full bg-transparent hover:bg-night">Terms</Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
