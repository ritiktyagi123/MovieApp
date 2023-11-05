import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {Bars3CenterLeftIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import TrendingMovies from '../components/trendingMovies';
import MovieList from '../components/movieList';
import { StatusBar } from 'expo-status-bar';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';
import { styles } from '../theme';
import RadioButtons from 'react-native-radio-buttons';

const ios = Platform.OS === 'ios';

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(''); // Initialize as an empty string
  const navigation = useNavigation();

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
    getPopularMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    console.log('got trending', data.results.length);
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    console.log('got upcoming', data.results.length);
    if (data && data.results) setUpcoming(data.results);
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    console.log('got top rated', data.results.length);
    if (data && data.results) setTopRated(data.results);
  };
  const getPopularMovies = async () => {
    const data = await fetchPopularMovies();
    console.log('got popular', data.results.length);
    if (data && data.results) setPopular(data.results);
  };

  const radioProps = ['Trending', 'Upcoming', 'Top Rated', 'Popular'];

  const toggleSelectedOption = (option) => {
    if (selectedOption === option) {
      setSelectedOption(''); // Deselect the option if it's already selected
    } else {
      setSelectedOption(option); // Select the option if it's not selected
    }
  };

  return (
    <View className="flex-1 bg-neutral-800">
      {/* search bar */}
      <SafeAreaView className={ios ? '-mb-2' : 'mb-3'}>
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4">
          <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mx-auto">
  {radioProps.map((option, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => toggleSelectedOption(option)}
      className={`p-2 border border-white rounded-full justify-between mx-1 mb-3 ${
        selectedOption === option
          ? 'bg-red-500 text-white'
          : 'text-white'
      }`}
      style={{ height: 40 }} // Adjust the height as needed
    >
      <Text className="text-white" >{option}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
          {selectedOption === '' && (
            <>
              {trending.length > 0 && <TrendingMovies data={trending} />}
              {upcoming.length > 0 && <MovieList title="Upcoming" data={upcoming} />}
              {topRated.length > 0 && <MovieList title="Top Rated" data={topRated} />}
              {popular.length > 0 && <MovieList title="Popular" data={popular} />}
            </>
          )}

          {selectedOption === 'Trending' && trending.length > 0 && <TrendingMovies data={trending} />}
          {selectedOption === 'Upcoming' && upcoming.length > 0 && <MovieList title="Upcoming" data={upcoming} />}
          {selectedOption === 'Top Rated' && topRated.length > 0 && <MovieList title="Top Rated" data={topRated} />}
          {selectedOption === 'Popular' && popular.length > 0 && <MovieList title="Popular" data={popular} />}
        </ScrollView>
      )}
    </View>
  );
}

