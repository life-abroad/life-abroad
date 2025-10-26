# Responsive Context

The `ResponsiveContext` provides responsive breakpoint information throughout the app.

## Usage

```tsx
import { useResponsive } from '../../contexts/ResponsiveContext';

function MyComponent() {
  const { isDesktop, isTablet, isMobile, isWeb, isNative, width, height } = useResponsive();

  return (
    <View>
      {isDesktop && <Text>Desktop Layout</Text>}
      {isTablet && <Text>Tablet Layout</Text>}
      {isMobile && <Text>Mobile Layout</Text>}
    </View>
  );
}
```

## Available Properties

- `width`: Current window width (number)
- `height`: Current window height (number)
- `isDesktop`: `true` when web width >= 1024px (lg breakpoint)
- `isTablet`: `true` when web width >= 768px and < 1024px (md breakpoint)
- `isMobile`: `true` when native OR web width < 768px
- `isWeb`: `true` when Platform.OS === 'web'
- `isNative`: `true` when Platform.OS !== 'web'

## Breakpoints

Based on Tailwind CSS default breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1023px (md)
- Desktop: >= 1024px (lg)
