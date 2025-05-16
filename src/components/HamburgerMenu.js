import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function HamburgerMenu() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ padding: 8, zIndex: 2 }}>
      <Icon name="menu" size={28} color="#111" />
    </TouchableOpacity>
  );
}

const styles = {
  logo: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#111',
    zIndex: -1,
  },
};