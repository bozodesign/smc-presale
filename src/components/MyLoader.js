import React from 'react'
import ContentLoader from 'react-content-loader'

const MyLoader = (props) => {
    return (
        <ContentLoader
            speed={2}
            width={340}
            height={84}
            viewBox="0 0 340 84"
            backgroundColor="#3d4f7c"
            foregroundColor="#3d4f7c"
            backgroundOpacity="#333"
            {...props}
        >
            <rect x="18" y="7" rx="3" ry="3" width="200" height="10" />
            <rect x="18" y="48" rx="3" ry="3" width="100" height="16" />
            <rect x="18" y="23" rx="3" ry="3" width="120" height="20" />
            <rect x="18" y="70" rx="3" ry="3" width="80" height="10" />
        </ContentLoader>
    )
}

export default MyLoader
