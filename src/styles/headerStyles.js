const headerStyles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      backgroundColor: 'white',
      borderBottom: '1px solid ',
      height: '64px',
    },
    leftSection: {
      flex: 1,
    },
    centerSection: {
      flex: 2,
      display: 'flex',
      alignItems: 'center',
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    pageTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0', // Remove margin for better mobile view
    },
    searchInput: {
      width: '200px', // Decrease width for mobile view
      marginLeft: '20px',
    },
    icon: {
      fontSize: '20px', // Decrease icon size for mobile view
      cursor: 'pointer',
      marginLeft: '20px',
    },
    avatar: {
      cursor: 'pointer',
    },
  };
  
  export default headerStyles;