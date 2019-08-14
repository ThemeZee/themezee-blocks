/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';
import { IconMagazineList } from '../../components/data/icons';

/**
 * Register block
 */
registerBlockType(
	'themezee-magazine-blocks/list',
	{
		title: __( 'Magazine List', 'themezee-magazine-blocks' ),

		description: __( 'Displays your latest posts in a list layout.', 'themezee-magazine-blocks' ),

		category: 'themezee-magazine-blocks',

		icon: IconMagazineList,

		keywords: [
			__( 'Posts', 'themezee-magazine-blocks' ),
			__( 'Magazine', 'themezee-magazine-blocks' ),
			__( 'ThemeZee', 'themezee-magazine-blocks' ),
		],

		supports: {
			html: false,
		},

		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/columns' ],
					transform: ( attributes ) => {
						return createBlock(
							'themezee-magazine-blocks/columns',
							{},
							[
								createBlock( 'themezee-magazine-blocks/column', { ...attributes } ),
								createBlock( 'themezee-magazine-blocks/column', { ...attributes } ),
							],
						);
					},
				},
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/grid' ],
					transform: ( attributes ) => {
						return createBlock( 'themezee-magazine-blocks/grid', { ...attributes } );
					},
				},
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/horizontal' ],
					transform: ( attributes ) => {
						return createBlock( 'themezee-magazine-blocks/horizontal', { ...attributes } );
					},
				},
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/vertical' ],
					transform: ( attributes ) => {
						return createBlock( 'themezee-magazine-blocks/vertical', { ...attributes } );
					},
				},
			],
		},

		edit,

		// Block is rendered server-side.
		save: () => {},
	},
);
