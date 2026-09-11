const ResumeAbout = () => {
  return (
    <div>
      <h1 className="text-4xl sm:text-5xl font-bold">Ben Adamsky</h1>
      <h2 className="mt-1 text-2xl sm:text-3xl font-medium">
        Co-founder & CTO
      </h2>
      <p className="mt-3">{profile.intro}</p>
    </div>
  );
};

export default ResumeAbout;
import { profile } from '@/data/profile';
