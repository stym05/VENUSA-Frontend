{
    !isMobile() && (
        <View style={styles.paddingContainer}>
            <Pressable
                onPress={() => setMenDropdownVisible(!menDropdownVisible)} // Click for Mobile
                onMouseEnter={() => {
                    setMenDropdownVisible(true);
                    setWomenDropdownVisible(false); // Close Women dropdown
                }}
                onMouseLeave={() => {
                    // Only close if the mouse leaves the entire dropdown area
                    if (!menDropdownVisible) return;
                    setTimeout(() => {
                        if (!menDropdownVisible) return; // Check again after timeout
                        setMenDropdownVisible(false);
                    }, 200); // Adjust timeout as needed
                }}
            >
                <Text style={styles.text}>Men</Text>
            </Pressable>
            {menDropdownVisible && (
                <View
                    onMouseEnter={() => setMenDropdownVisible(true)} // Keep open when hovering over dropdown
                    onMouseLeave={() => {
                        // Close only if the mouse leaves the entire dropdown area
                        setMenDropdownVisible(false);
                    }}
                >
                    {renderDropdown("men")}
                </View>
            )}
        </View>
    )
}

{/* WOMEN Dropdown */ }
{
    !isMobile() && (
        <View style={styles.paddingContainer}>
            <Pressable
                onPress={() => setWomenDropdownVisible(!womenDropdownVisible)}
                onMouseEnter={() => {
                    setWomenDropdownVisible(true);
                    setMenDropdownVisible(false); // Close Men dropdown
                }}
                onMouseLeave={() => {
                    // Only close if the mouse leaves the entire dropdown area
                    if (!womenDropdownVisible) return;
                    setTimeout(() => {
                        if (!womenDropdownVisible) return; // Check again after timeout
                        setWomenDropdownVisible(false);
                    }, 200); // Adjust timeout as needed
                }}
            >
                <Text style={styles.text}>Women</Text>
            </Pressable>
            {womenDropdownVisible && (
                <View
                    onMouseEnter={() => setWomenDropdownVisible(true)} // Keep open when hovering over dropdown
                    onMouseLeave={() => {
                        // Close only if the mouse leaves the entire dropdown area
                        setWomenDropdownVisible(false);
                    }}
                >
                    {renderDropdown("women")}
                </View>
            )}
        </View>
    )
} 