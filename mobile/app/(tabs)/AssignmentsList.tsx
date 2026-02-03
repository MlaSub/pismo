import { ThemedDocumentUploader } from '@/components/themed-document-uploader';
import { ThemedInput } from '@/components/themed-input';
import ThemedScroll from '@/components/themed-scroll';
import { ThemedText } from '@/components/themed-text';

export default function AssignmentsList() {
    return (
        <ThemedScroll>
            <ThemedText type="title">Assignment</ThemedText>
            <ThemedText type="defaultSemiBold">Write, share or upload your assignment</ThemedText>
            <ThemedInput placeholder="Write your essay" height={120} />
            <ThemedDocumentUploader maxFiles={1} />
        </ThemedScroll>
    );
}