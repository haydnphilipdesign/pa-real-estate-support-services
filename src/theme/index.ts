import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    brand: {
      blue: "#23374f",
      gold: "#e9c476",
      red: "#ca2b28",
      black: "#000000",
      // Blue shades
      blue50: "#eef1f4",
      blue100: "#cfd6de",
      blue200: "#b0bbc8",
      blue300: "#91a0b2",
      blue400: "#72859c",
      blue500: "#23374f", // Primary blue
      blue600: "#1c2c3f",
      blue700: "#15212f",
      blue800: "#0e1620",
      blue900: "#070b10",
      // Gold shades
      gold50: "#fdf8ed",
      gold100: "#f9ebcc",
      gold200: "#f4deab",
      gold300: "#efd18a",
      gold400: "#ebc469",
      gold500: "#e9c476", // Primary gold
      gold600: "#ba9d5e",
      gold700: "#8c7647",
      gold800: "#5d4e2f",
      gold900: "#2f2718",
    },
    // Semantic colors
    primary: "#23374f",
    secondary: "#e9c476",
    accent: "#ca2b28",
    text: {
      primary: "#000000",
      secondary: "#e9c476", // Changed from blue to gold for better contrast
      light: "#ffffff",
    },
  },
  fonts: {
    heading: "Merriweather, serif",
    body: "Inter, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "lg",
      },
      variants: {
        primary: {
          bg: "brand.blue",
          color: "white",
          _hover: {
            bg: "brand.blue600",
            _disabled: {
              bg: "brand.blue300",
            },
          },
        },
        secondary: {
          bg: "brand.gold",
          color: "brand.blue",
          _hover: {
            bg: "brand.gold600",
            _disabled: {
              bg: "brand.gold300",
            },
          },
        },
        outline: {
          bg: "transparent",
          color: "brand.blue",
          border: "2px solid",
          borderColor: "brand.blue",
          _hover: {
            bg: "brand.blue",
            color: "white",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: "brand.blue",
        _hover: {
          color: "brand.gold",
          textDecoration: "none",
        },
      },
    },
    Heading: {
      baseStyle: {
        color: "brand.blue",
        fontFamily: "Merriweather, serif",
      },
    },
    Text: {
      baseStyle: {
        color: "brand.blue",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "brand.blue",
      },
      "::selection": {
        bg: "brand.gold",
        color: "brand.blue",
      },
    },
  },
});

export default customTheme;
