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
import { IconMagazineHorizontal } from '../../components/data/icons';

/**
 * Register block
 */
registerBlockType(
	'themezee-magazine-blocks/horizontal',
	{
		title: __( 'Magazine Horizontal', 'themezee-magazine-blocks' ),

		description: __( 'Displays your latest posts in a horizontal box.', 'themezee-magazine-blocks' ),

		category: 'themezee-magazine-blocks',

		icon: IconMagazineHorizontal,

		keywords: [
			__( 'Posts', 'themezee-magazine-blocks' ),
			__( 'Box', 'themezee-magazine-blocks' ),
			__( 'ThemeZee', 'themezee-magazine-blocks' ),
		],

		supports: {
			html: false,
		},

		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/magazine-columns' ],
					transform: ( attributes ) => {
						return createBlock(
							'themezee-magazine-blocks/magazine-columns',
							{},
							[
								createBlock( 'themezee-magazine-blocks/magazine-column', { ...attributes } ),
								createBlock( 'themezee-magazine-blocks/magazine-column', { ...attributes } ),
							],
						);
					},
				},
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/magazine-grid' ],
					transform: ( attributes ) => {
						return createBlock( 'themezee-magazine-blocks/magazine-grid', { ...attributes } );
					},
				},
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/magazine-list' ],
					transform: ( attributes ) => {
						return createBlock( 'themezee-magazine-blocks/magazine-list', { ...attributes } );
					},
				},
				{
					type: 'block',
					blocks: [ 'themezee-magazine-blocks/magazine-vertical' ],
					transform: ( attributes ) => {
						return createBlock( 'themezee-magazine-blocks/magazine-vertical', { ...attributes } );
					},
				},
			],
		},

		edit,

		// Block is rendered server-side.
		save: () => {},
	},
);