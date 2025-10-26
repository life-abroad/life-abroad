import { useResponsive } from 'contexts/ResponsiveContext';
import React from 'react';
import { FlatList, View } from 'react-native';

export default function ResponsiveWrapper({
  children,
  className = '',
  numColumns = 2,
  handleLayout,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  numColumns?: number;
  handleLayout?: (event: any) => void;
  style?: object;
}) {
  const { isDesktop } = useResponsive();
  return (
    <View
      style={{ flex: 1, ...style }}
      onLayout={handleLayout}
      className={`${isDesktop && (numColumns === 1 ? 'mx-auto w-[80%]' : 'mx-auto w-[90%]')} ${className}`}>
      {children}
    </View>
  );
}

export function ResponsiveFullFlatListWrapper({
  children,
  className = '',
  handleLayout,
  style,
  renderItem,
  keyExtractor,
  data,
  scrollY,
  headerHeight,
}: {
  children?: React.ReactNode;
  className?: string;
  handleLayout?: (event: any) => void;
  style?: object;
  renderItem: any;
  keyExtractor: any;
  data: any;
  scrollY: any;
  headerHeight: number;
}) {
  const { isDesktop } = useResponsive();

  return (
    <ResponsiveWrapper
      style={{
        paddingTop: headerHeight + (isDesktop ? 10 : 0),
      }}>
      <View
        pointerEvents="box-none"
        className="flex-1 bg-background px-1 pt-2 web:lg:rounded-md web:lg:border-[1px] web:lg:border-white/10">
        {children}
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onScroll={(event) => {
            scrollY.setValue(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: isDesktop ? 0 : 70,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ResponsiveWrapper>
  );
}
