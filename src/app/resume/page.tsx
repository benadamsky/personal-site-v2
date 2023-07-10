import ResumeAbout from '@/components/ResumeAbout';
import ResumeExperience from '@/components/ResumeExperience';
import ResumeSidebar from '@/components/ResumeSidebar';

const Resume = () => {
  return (
    <div className="py-32 px-4 sm:px-12 xl:px-48 flex flex-col lg:flex-row justify-between items-center lg:items-start">
      <div className="sm:w-2/3 space-y-12">
        <ResumeAbout />
        <ResumeExperience />
      </div>
      <div className="sm:w-2/3 lg:w-72 mt-8 lg:mt-2">
        <ResumeSidebar />
      </div>
    </div>
  );
};

export default Resume;
