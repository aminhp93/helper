
const getDefaultWorkLayout = (percentHeightTop = 40, percentWidth = 20) => {
    return [
        {
            'type': 'row',
            'content': [
                {
                    'type': 'component',
                    'component': 'CurrentPrice',
                    'componentName': 'lm-react-component',
                    'isClosable': true,
                    'reorderEnabled': true,
                    'title': 'CurrentPrice',
                    'width': 30
                },

                {
                    'type': 'stack',
                    'width': 70,
                    'isClosable': true,
                    'reorderEnabled': true,
                    'title': '',
                    'content': [
                        {
                            'type': 'component',
                            'component': 'ChartTV',
                            'componentName': 'lm-react-component',
                            'isClosable': true,
                            'reorderEnabled': true,
                            'title': 'ChartTV'
                        },
                        {
                            'type': 'component',
                            'component': 'Note',
                            'componentName': 'lm-react-component',
                            'isClosable': true,
                            'reorderEnabled': true,
                            'title': 'Note'
                        }
                    ]
                }
            ]
        }
    ]
}

const getDefaultLifeLayout = (percentHeightTop = 40, percentWidth = 20) => {
    return [

        {
            'type': 'row',
            'content': [
                {
                    'type': 'column',
                    'height': 50,
                    'content': [
                        {
                            'type': 'component',
                            'component': 'Tennis',
                            'componentName': 'lm-react-component',
                            'isClosable': true,
                            'reorderEnabled': true,
                            'title': 'Tennis',
                            'width': 50
                        },
                        {
                            'type': 'component',
                            'component': 'Book',
                            'componentName': 'lm-react-component',
                            'isClosable': true,
                            'reorderEnabled': true,
                            'title': 'Book',
                            'width': 50
                        },
                    ]
                },
                {
                    'type': 'column',
                    'height': 50,
                    'content': [
                        {
                            'type': 'component',
                            'component': 'MovieActorSpeech',
                            'componentName': 'lm-react-component',
                            'isClosable': true,
                            'reorderEnabled': true,
                            'title': 'MovieActorSpeech'
                        }
                    ]
                }
            ]

        }
    ]
}

const getDefaultFilterSymbolLayout = (percentHeightTop = 40, percentWidth = 20) => {
    return [

        {
            'type': 'row',
            'content': [
                {
                    'type': 'component',
                    'component': 'CurrentPrice',
                    'componentName': 'lm-react-component',
                    'isClosable': true,
                    'reorderEnabled': true,
                    'title': 'CurrentPrice'
                }
            ]
        }
    ]
}

const getDefaultLayout = (percentHeightTop = 40, percentWidth = 20) => {
    return [

        {
            'type': 'row',
            'content': [
                {
                    'type': 'component',
                    'component': 'Test',
                    'componentName': 'lm-react-component',
                    'isClosable': true,
                    'reorderEnabled': true,
                    'title': 'Test'
                },
                {
                    'type': 'component',
                    'component': 'Test',
                    'componentName': 'lm-react-component',
                    'isClosable': true,
                    'reorderEnabled': true,
                    'title': 'Test'
                },
                {
                    'type': 'component',
                    'component': 'Test',
                    'componentName': 'lm-react-component',
                    'isClosable': true,
                    'reorderEnabled': true,
                    'title': 'Test'
                }
            ]
        }
    ]
}

export default {
    getDefaultWorkLayout,
    getDefaultLifeLayout,
    getDefaultFilterSymbolLayout,
    getDefaultLayout
}
