import { Box } from "@chakra-ui/react";

function ResponsiveBox() {
  return (
    <Box
      width={{ base: "100%", md: "50%", lg: "25%" }}
      p={4}
      bg="teal.500"
    >
      Responsive Box
    </Box>
  );
}

export default ResponsiveBox;
