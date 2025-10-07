import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';


const PostsList = ({
  posts = [],
  currentUserId,
  onLike,
  onDelete, // (post, index) => Promise | void
  showEmptyFallback = true,
}) => {
  const [localPosts, setLocalPosts] = useState(posts);

  // Sync when parent posts change
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);
//   console.log('====================================');
//   console.log(localPosts);
//   console.log('====================================');
/**
 * LOG  {"__v": 0, "_id": "68e315a5badc1c4e2244e6b5", "content": "Jdjdj", "createdAt": "2025-10-06T01:04:37.156Z", "createdBy": {"U_Id": "14725836", "_id": "68e043ee072a126df4bc3aa7", "description": "this is the foundcer of flerto and many more multi bilionarthis is the foundcer of flerto and many more multi bilionarthis is the foundcer of flerto and many more multi bilionarthis is the foundcer of", "tags": ["friends", "chat", "jcuditsiuxkyxiyxutzt"]}, "likes": [], "updatedAt": "2025-10-06T01:04:37.156Z"}
 */

  const handleLike = async (item, index) => {
    if (!currentUserId) return;
    const userId = currentUserId;
    const already = Array.isArray(item.likes) && item.likes.includes(userId);

    // optimistic toggle
    setLocalPosts(prev => {
      const copy = [...prev];
      const p = { ...copy[index] };
      if (Array.isArray(p.likes)) {
        p.likes = already ? p.likes.filter(l => l !== userId) : [...p.likes, userId];
      } else {
        const num = typeof p.likes === 'number' ? p.likes : 0;
        p.likes = already ? Math.max(num - 1, 0) : num + 1;
      }
      copy[index] = p;
      return copy;
    });

    try {
      // If parent supplies onLike it should invoke likePost(postId)
      if (onLike) await Promise.resolve(onLike(item, index));
    } catch (e) {
      // revert
      setLocalPosts(prev => {
        const copy = [...prev];
        const p = { ...copy[index] };
        if (Array.isArray(p.likes)) {
          // revert to prior state
          const had = already;
          if (had) {
            // we tried to unlike but failed -> ensure user present
            if (!p.likes.includes(userId)) p.likes = [...p.likes, userId];
          } else {
            // we tried to like but failed -> remove
            p.likes = p.likes.filter(l => l !== userId);
          }
        } else {
          const num = typeof p.likes === 'number' ? p.likes : 0;
          p.likes = already ? num + 1 : Math.max(num - 1, 0);
        }
        copy[index] = p;
        return copy;
      });
      Alert.alert('Like Failed', e?.message || 'Unable to update like');
    }
  };

  const confirmDelete = (item, index) => {
    if (!onDelete) return;
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // optimistic removal
            setLocalPosts(prev => prev.filter((_, i) => i !== index));
            try {
              await Promise.resolve(onDelete(item, index));
            } catch (e) {
              // restore on failure
              setLocalPosts(prev => {
                const clone = [...prev];
                clone.splice(index, 0, item);
                return clone;
              });
              Alert.alert('Delete Failed', e?.message || 'Unable to delete post');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => {
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    const id = item?.createdBy?.U_Id|| 'USER';
    const content = item.content || item.description || '...';
    const isOwner = currentUserId && (id === currentUserId || item.userId === currentUserId);
    const likeCount = Array.isArray(item.likes) ? item.likes.length : (item.likes || 0);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4 flex-row"
        delayLongPress={350}
        onLongPress={() => {
          // Only allow delete for owner
          if (isOwner) confirmDelete(item, index);
        }}
      >
        <View className="flex-1 pr-3">
          <Text className="text-white font-semibold text-sm mb-1">{id}{isOwner ? ' (Me)' : ''}</Text>
          <Text className="text-gray-300 text-sm leading-5" numberOfLines={6}>{content}</Text>
          <View className="flex-row mt-3">
            <Text className="text-gray-500 text-xs">❤️ {likeCount}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleLike(item, index)}
          className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center self-start"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base">👍</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (!localPosts.length && showEmptyFallback) {
    return (
      <View className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <Text className="text-white font-medium mb-2">No posts yet</Text>
        <Text className="text-gray-400 text-sm">Start the conversation by creating your first post.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={localPosts}
      keyExtractor={(item, i) => String(item.id || item._id || i)}
      renderItem={renderItem}
      scrollEnabled={false}
    />
  );
};

export default PostsList;
