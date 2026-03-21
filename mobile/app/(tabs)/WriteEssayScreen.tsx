import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ThemedScroll from '@/components/themed-scroll';


const WriteEssayScreen = () => {
    return (
        <ThemedScroll>
            <ThemedView>
                <ThemedText type="title">WriteEssayScreen</ThemedText>
            </ThemedView>
        </ThemedScroll >
    );
};

export default WriteEssayScreen;
