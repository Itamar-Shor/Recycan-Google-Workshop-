import * as Icons from '@expo/vector-icons'

export const BINS_ID =
{
    PAPER: 0,
    GLASS: 1,
    //    BATTERIES: 2,
    PACKAGING: 2,
    CLOTHES: 3,
    ELECTRONIC: 4,
    BOTTLES: 5,
    CARTON: 6,
    //ORGANIC: 5,
}


export const BINS =
    [
        {
            name: 'Paper',
            IconLib: Icons.AntDesign,
            IconName: 'copy1',
            color: '#0067BD',
            lightColor: '#D1EAFF',
            info: 'Paper and thin carton',
            examples: [
                'Newspapers & other papers',
                'Paper packings of sugar & flour', 
                'Egg packs',
                'Pizza boxes',
                'Cornflakes boxes'
            ],
            image: require("../assets/blue_bin.png"),
            id: 0
        },
        {
            name: 'Glass',
            IconLib: Icons.FontAwesome,
            IconName: 'glass',
            color: '#5919A4',
            lightColor: '#E4D5F5',
            info: 'Glass packging',
            examples: [
                'Olive oil bottles',
                'Perfume bottles',
                'Coffee jars',
                'Honey & jam jars',
            ],
            notes: [
                "Empty the packaging and remove the top before recycling"
            ],
            image: require("../assets/purple_bin.png"),
            id: 1
        },
        /*        {
                    name: 'Batteries',
                    IconLib: Icons.Entypo,
                    IconName: 'battery',
                    color: '#d6223d',
                    lightColor: '#E4C1C6',
                    info: 'Batteries (Most electornic stores accept them).',
                    examples:'',
                    image:require("../assets/temp_batteries_bin.png"),
                    id: 2
                },*/
        {
            name: 'Packaging',
            IconLib: Icons.Entypo,
            IconName: 'box',
            color: '#FB712F',
            lightColor: '#FDD6C2',
            info: 'Plastic/metal packaging, beverage cartons',
            examples: [
                'Plastic food and hygiene packages',
                'Metal packages (canned food)',
                'Beverage cartons (juice, milk)',
                'Styrofoam packages'
            ],
            image: require("../assets/orange_bin.png"),
            id: 2
        },
        {
            name: 'Clothes',
            IconLib: Icons.FontAwesome5,
            IconName: 'tshirt',
            //color: '#e892da',
            color: '#B61982',
            lightColor: '#C9B9C3',
            info: 'Old clothes',
            image: require("../assets/clothes_bin.png"),
            id: 3
        },
        {
            name: 'Electronics',
            IconLib: Icons.Entypo,
            IconName: 'battery',
            //color: "#73a7c7",
            color: "#d6223d",
            lightColor: '#E4C1C6',
            info: "Batteries, small electronics devices",
            notes: [
                "Old batteries and small electronics are accepted by electronics stores",
                "For larger electronics such as refrigerators and washing machines, call a service or trade in"
            ],
            examples: [
                'Batteries',
                'Computer parts, laptops, phones',
                'Other small electronics'
            ],
            image: require("../assets/electronics_bin.png"),
            id: 4
        },
        {
            name: 'Bottles',
            IconLib: Icons.MaterialCommunityIcons,
            IconName: 'bottle-soda-classic',
            //color: "#32a83e",
            color: "#019658",
            lightColor: '#B9DACD',
            info: "Large bottles",
            examples: [
                "Bottles of 1.5 liters or more",
                "Liquid detergent bottles"
            ],
            image: require("../assets/bottles_bin.png"),
            id: 5
        },
        {
            name: "Cardboard",
            IconLib: Icons.FontAwesome5,
            IconName: "box-open",
            color: "#a86c43",
            lightColor: '#CBBDB4',
            info: "Thick cardboard",
            notes: ["Make sure to flatten cardboard before recycling"],
            image: require("../assets/carton_bin.png"),
            overridePinColor: "wheat",
            id: 6
        }
        /*{
            name: 'Organic',
            IconLib: Icons.MaterialCommunityIcons,
            IconName: 'food-apple',
            color: '#994C00',
            info: 'organic: basically any food left-overs',
            examples:'',
            image:require("../assets/purple_bin.png"),
        },*/
    ]
