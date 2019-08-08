/**
 * External dependencies
 */
import classnames from 'classnames';
const {
	isUndefined,
	pickBy,
} = lodash;

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { withSelect } = wp.data;

const {
	Component,
	Fragment,
} = wp.element;

const {
	__,
} = wp.i18n;

const {
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	Spinner,
	TextControl,
	ToggleControl,
} = wp.components;

/**
 * Internal dependencies
 */
import CategorySelect from './controls/category-select';
import AuthorSelect from './controls/author-select';
import OrderSelect from './controls/order-select';
import MagazineTemplate from './magazine-template';

/**
 * Block Edit Component
 */
class MagazineBlock extends Component {
	render() {
		const {
			attributes,
			className,
			setAttributes,
			latestPosts,
			magazineBlockIcon,
			magazineTemplate,
		} = this.props;

		const {
			categories,
			tags,
			author,
			order,
			orderBy,
			numberOfPosts,
			offset,
			metaPosition,
			showDate,
			showAuthor,
			showCategories,
			showComments,
			excerptLength,
			moreText,
		} = attributes;

		const blockClasses = classnames( className, 'tz-magazine-block' );

		const inspectorControls = (
			<InspectorControls>

				<PanelBody title={ __( 'Content Settings', 'themezee-blocks' ) } initialOpen={ false }>

					<CategorySelect
						selectedCategoryId={ categories }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
					/>

					<TextControl
						label={ __( 'Tags', 'themezee-blocks' ) }
						value={ tags }
						onChange={ ( value ) => setAttributes( { tags: '' !== value ? value : undefined } ) }
					/>

					<AuthorSelect
						selectedAuthorId={ author }
						onAuthorChange={ ( value ) => setAttributes( { author: '' !== value ? value : undefined } ) }
					/>

					<OrderSelect
						{ ...{ order, orderBy } }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
					/>

					<RangeControl
						key="tz-number-of-posts-control"
						label={ __( 'Number of posts', 'themezee-blocks' ) }
						value={ numberOfPosts }
						onChange={ ( value ) => setAttributes( { numberOfPosts: value } ) }
						min={ 1 }
						max={ 30 }
					/>

					<RangeControl
						key="tz-offset-control"
						label={ __( 'Skip Posts', 'themezee-blocks' ) }
						value={ offset }
						onChange={ ( value ) => setAttributes( { offset: value } ) }
						min={ 0 }
						max={ 30 }
					/>

				</PanelBody>

				{ this.props.layoutSettings ? this.props.layoutSettings : null }

				<PanelBody title={ __( 'Post Settings', 'themezee-blocks' ) } initialOpen={ false }>

					<SelectControl
						label={ __( 'Post Details', 'themezee-blocks' ) }
						value={ metaPosition }
						onChange={ ( value ) => setAttributes( { metaPosition: value } ) }
						options={ [
							{ value: 'above-title', label: __( 'Show above post title', 'themezee-blocks' ) },
							{ value: 'below-title', label: __( 'Show below post title', 'themezee-blocks' ) },
						] }
					/>

					<ToggleControl
						label={ __( 'Display Date', 'gt-blocks' ) }
						checked={ !! showDate }
						onChange={ () => setAttributes( { showDate: ! showDate } ) }
					/>

					<ToggleControl
						label={ __( 'Display Author', 'gt-blocks' ) }
						checked={ !! showAuthor }
						onChange={ () => setAttributes( { showAuthor: ! showAuthor } ) }
					/>

					<ToggleControl
						label={ __( 'Display Categories', 'gt-blocks' ) }
						checked={ !! showCategories }
						onChange={ () => setAttributes( { showCategories: ! showCategories } ) }
					/>

					<ToggleControl
						label={ __( 'Display Comments', 'gt-blocks' ) }
						checked={ !! showComments }
						onChange={ () => setAttributes( { showComments: ! showComments } ) }
					/>

					<RangeControl
						label={ __( 'Excerpt Length', 'themezee-blocks' ) }
						value={ excerptLength }
						onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
						min={ 0 }
						max={ 100 }
					/>

					{ excerptLength > 0 && (
						<TextControl
							label={ __( 'Read More Text', 'themezee-blocks' ) }
							value={ moreText }
							onChange={ ( value ) => setAttributes( { moreText: value } ) }
						/>
					) }

				</PanelBody>

			</InspectorControls>
		);

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>

					{ this.props.blockControls ? this.props.blockControls : null }
					{ inspectorControls }

					<Placeholder
						icon={ magazineBlockIcon }
						label={ __( 'Magazine Grid', 'themezee-blocks' ) }
						className="tz-posts-placeholder"
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found. You may have to reconfigure your content settings.', 'themezee-blocks' )
						}
					</Placeholder>

				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > numberOfPosts ?
			latestPosts.slice( 0, numberOfPosts ) :
			latestPosts;

		return (
			<Fragment>

				{ this.props.blockControls ? this.props.blockControls : null }
				{ inspectorControls }

				<div className={ blockClasses }>

					<MagazineTemplate
						posts={ displayPosts }
						attributes={ attributes }
						template={ magazineTemplate }
					/>

				</div>

			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { categories, tags, author, numberOfPosts, order, orderBy, offset } = props.attributes;
		const { getEntityRecords } = select( 'core' );

		// Retrieve Tag IDs from Tag names.
		let tagsIDs;
		if ( ! ( ! tags || 0 === tags.length ) ) {
			const tagsObj = getEntityRecords( 'taxonomy', 'post_tag', { per_page: -1, slug: tags } );
			if ( tagsObj ) {
				tagsIDs = Object.keys( tagsObj ).reduce( ( str, key ) => str + tagsObj[ key ].id + ',', '' );
				tagsIDs = tagsIDs.slice( 0, -1 );
			}
		}
		const tagsQuery = '' !== tagsIDs ? { tags: tagsIDs } : undefined;

		// Query Posts.
		const latestPostsQuery = pickBy( {
			categories,
			...tagsQuery,
			author,
			order,
			orderby: orderBy,
			per_page: numberOfPosts,
			offset,
		}, ( value ) => ! isUndefined( value ) );

		return {
			latestPosts: getEntityRecords( 'postType', 'post', latestPostsQuery ),
		};
	} ),
] )( MagazineBlock );