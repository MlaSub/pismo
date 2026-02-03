import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

const BORDER_RADIUS = 12;
const BORDER_WIDTH = 2;
const ICON_SIZE = 32;
const SMALL_ICON_SIZE = 20;
const PADDING = 24;
const FILE_ITEM_PADDING = 12;
const GAP = 12;

interface DocumentFile {
    uri: string;
    name: string;
    mimeType?: string;
    size?: number;
}

export interface ThemedDocumentUploaderProps {
    onFilesChange?: (files: DocumentFile[]) => void;
    multiple?: boolean;
    fileTypes?: string[];
    maxFiles?: number;
    placeholder?: string;
}

export function ThemedDocumentUploader({
    onFilesChange,
    multiple = false,
    fileTypes = ['application/pdf'],
    maxFiles = 1,
    placeholder = 'Tap to upload documents',
}: ThemedDocumentUploaderProps) {
    const [files, setFiles] = useState<DocumentFile[]>([]);

    const backgroundColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const tintColor = useThemeColor({}, 'tint');
    const iconColor = useThemeColor({}, 'icon');
    const errorColor = useThemeColor({}, 'error');

    const handlePick = async () => {
        if (multiple && files.length >= maxFiles) {
            return;
        }

        const result = await DocumentPicker.getDocumentAsync({
            type: fileTypes,
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return;
        }

        const newFiles = result.assets.map((asset) => ({
            uri: asset.uri,
            name: asset.name,
            mimeType: asset.mimeType ?? undefined,
            size: asset.size ?? undefined,
        }));

        const updatedFiles = multiple
            ? [...files, ...newFiles].slice(0, maxFiles)
            : newFiles.slice(0, 1);

        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    };

    const handleRemove = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    };

    const formatFileSize = (bytes?: number): string => {
        if (bytes === undefined) {
            return '';
        }
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const getFileIcon = (mimeType?: string): keyof typeof Ionicons.glyphMap => {
        if (mimeType?.startsWith('image/')) {
            return 'image-outline';
        }
        if (mimeType === 'application/pdf') {
            return 'document-text-outline';
        }
        return 'document-outline';
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={handlePick}
                style={[
                    styles.dropzone,
                    { backgroundColor, borderColor },
                ]}
            >
                <Ionicons name="cloud-upload-outline" size={ICON_SIZE} color={tintColor} />
                <ThemedText style={styles.placeholder}>{placeholder}</ThemedText>
                {multiple ? <ThemedText style={styles.hint}>
                        {files.length} / {maxFiles} files
                    </ThemedText> : null}
            </Pressable>

            {files.length > 0 && (
                <View style={styles.fileList}>
                    {files.map((file, index) => (
                        <View
                            key={`${file.name}-${index}`}
                            style={[styles.fileItem, { backgroundColor, borderColor }]}
                        >
                            <Ionicons
                                name={getFileIcon(file.mimeType)}
                                size={SMALL_ICON_SIZE}
                                color={iconColor}
                            />
                            <View style={styles.fileInfo}>
                                <ThemedText numberOfLines={1} style={styles.fileName}>
                                    {file.name}
                                </ThemedText>
                                {file.size !== undefined && (
                                    <ThemedText style={styles.fileSize}>
                                        {formatFileSize(file.size)}
                                    </ThemedText>
                                )}
                            </View>
                            <Pressable
                                onPress={() => handleRemove(index)}
                                hitSlop={8}
                                style={styles.removeButton}
                            >
                                <Ionicons name="close-circle" size={SMALL_ICON_SIZE} color={errorColor} />
                            </Pressable>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: GAP,
    },
    dropzone: {
        alignItems: 'center',
        borderRadius: BORDER_RADIUS,
        borderStyle: 'dashed',
        borderWidth: BORDER_WIDTH,
        gap: 8,
        justifyContent: 'center',
        padding: PADDING,
    },
    fileInfo: {
        flex: 1,
    },
    fileItem: {
        alignItems: 'center',
        borderRadius: BORDER_RADIUS / 2,
        borderWidth: 1,
        flexDirection: 'row',
        gap: GAP,
        padding: FILE_ITEM_PADDING,
    },
    fileList: {
        gap: 8,
    },
    fileName: {
        flex: 1,
    },
    fileSize: {
        fontSize: 12,
        opacity: 0.6,
    },
    hint: {
        fontSize: 12,
        opacity: 0.6,
    },
    placeholder: {
        textAlign: 'center',
    },
    removeButton: {
        padding: 4,
    },
});
