import ResumeAbout from '@/components/ResumeAbout';
import ResumeExperience from '@/components/ResumeExperience';
import ResumeSidebar from '@/components/ResumeSidebar';

const Resume = () => {
  return (
    <div className="py-20 px-12 xl:px-48 flex justify-between">
      <div className="w-2/3 space-y-12">
        <ResumeAbout />
        <ResumeExperience />
      </div>
      <div className="w-72 mt-2">
        <ResumeSidebar />
      </div>
    </div>
  );
};

export default Resume;
