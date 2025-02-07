import { Box, Flex } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      
      {/* Main Content */}
      <Box as="main" flex="1" pt="5rem">
        {children}
      </Box>
      
      <Footer />
    </Flex>
  );
}

export default MainLayout;
