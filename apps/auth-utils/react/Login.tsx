import React, { Fragment } from 'react'
// import productReleaseDate from './graphql/productReleaseDate.graphql'
import { ExtensionPoint } from 'vtex.render-runtime'
// import{ /*ModalContent*/ ModalTrigger }from 'vtex.modal-layout'
import { useQuery	} from 'react-apollo'
import getProfile from "./graphql/getUserProfile.graphql"

interface ConditionalLoginProps {
	children: React.ReactChild
}


const ConditionalLogin: StorefrontFC<ConditionalLoginProps> = () => {
	const { data, loading }	= useQuery(getProfile, {ssr: false})

	if (loading) {
		return <ExtensionPoint id="conditional-login.unlogged" />
	}
	return ( 
		<Fragment>
			{data?.profile ? ( 
				<ExtensionPoint id="conditional-login.logged" />
			) : (	
				<ExtensionPoint id="conditional-login.unlogged" />
			)}
		</Fragment>
	)
}

// ConditionalLogin.schema = {
// 	title: 'editor.conditional-login.title',
// 	description: 'editor.conditional-login.description',
// 	type: 'object',
// 	properties: {
// 		text: {
// 			title: "texto teste",
// 			description: 'apenas um texto teste',
// 			type: 'string',
// 			default: null,
// 		}
// 	}
// }

export default ConditionalLogin
