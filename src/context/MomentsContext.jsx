import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig'; // ensure correct imports

const MomentsContext = createContext();

export const useMoments = () => useContext(MomentsContext);

export const MomentsProvider = ({ children }) => {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchUserMoments = async () => {
//     if (hasFetched.current) return; // Prevent duplicate fetches
//       hasFetched.current = true;
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("No logged-in user found.");
        return;
      }


      console.log("Current user:", user);

      const q = query(
        collection(db, 'moments'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);

      const fetchedMoments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(fetchedMoments);

      // Sort by date if needed
      fetchedMoments.sort((a, b) => new Date(a.date) - new Date(b.date));

      setMoments(fetchedMoments);
      console.log("Moments look like these :",fetchedMoments);
    } catch (error) {
      console.error("Error fetching user moments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMoments();
  }, []);

  return (
    <MomentsContext.Provider value={{ moments, setMoments, fetchUserMoments, loading }}>
      {children}
    </MomentsContext.Provider>
  );
};
