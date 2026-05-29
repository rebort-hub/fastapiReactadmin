import DarkModeContainer from '@/components/DarkModeContainer';

const GlobalFooter = () => {
  return (
    <DarkModeContainer className="h-full flex-center">
      <a
        href="https://github.com/rebort-hub/fastapiReactadmin"
        rel="noopener noreferrer"
        target="_blank"
      >
        Copyright rebort © 2026 FastapiReactAdmin
      </a>
    </DarkModeContainer>
  );
};

export default GlobalFooter;
