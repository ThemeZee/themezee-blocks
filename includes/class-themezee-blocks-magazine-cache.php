<?php
/**
 * Transient caching complex database queries for more performance.
 *
 * @package ThemeZee Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ThemeZee Blocks Magazine Grid Class
 */
class ThemeZee_Blocks_Magazine_Cache {
	/**
	 * Get Post IDs.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array Returns the post ids.
	 */
	static function get_post_ids( $attributes ) {

		// Generate Cache ID.
		$cache_id = self::get_cache_id( $attributes );

		// Get cached post ids.
		$cached_post_ids = get_transient( 'themezee_blocks_cached_post_ids' );

		if ( ! isset( $cached_post_ids[ $cache_id ] ) || is_customize_preview() ) {

			// Get query arguments.
			$query_arguments = self::get_query_arguments( $attributes );

			// Get Posts from Database.
			$query = new WP_Query( $query_arguments );

			// Create an array of all post ids.
			$cached_post_ids[ $cache_id ] = $query->posts;

			// Set Transient.
			set_transient( 'themezee_blocks_cached_post_ids', $cached_post_ids );
		}

		return apply_filters( 'themezee_blocks_cached_post_ids', $cached_post_ids[ $cache_id ], $cache_id );
	}

	/**
	 * Get Query Arguments.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array Returns query arguments.
	 */
	static function get_query_arguments( $attributes ) {
		$query_arguments = array(
			'fields'              => 'ids',
			'posts_per_page'      => absint( $attributes['numberOfPosts'] ),
			'post_status'         => 'publish',
			'order'               => esc_attr( $attributes['order'] ),
			'orderby'             => esc_attr( $attributes['orderBy'] ),
			'suppress_filters'    => false,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		);

		if ( isset( $attributes['categories'] ) ) {
			$query_arguments['cat'] = intval( $attributes['categories'] );
		}

		if ( isset( $attributes['tags'] ) ) {
			$query_arguments['tag'] = esc_attr( $attributes['tags'] );
		}

		if ( isset( $attributes['author'] ) ) {
			$query_arguments['author'] = intval( $attributes['author'] );
		}

		if ( isset( $attributes['offset'] ) && $attributes['offset'] > 0 ) {
			$query_arguments['offset'] = absint( $attributes['offset'] );
		}

		return $query_arguments;
	}

	/**
	 * Get Cache ID
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns cache id.
	 */
	static function get_cache_id( $attributes ) {

		// Add query arguments to cache id string.
		$cache_id = (string) intval( $attributes['numberOfPosts'] ) . esc_attr( $attributes['order'] ) . esc_attr( $attributes['orderBy'] );

		if ( isset( $attributes['categories'] ) ) {
			$cache_id .= (string) intval( $attributes['categories'] );
		}

		if ( isset( $attributes['tags'] ) ) {
			$cache_id .= esc_attr( $attributes['tags'] );
		}

		if ( isset( $attributes['author'] ) ) {
			$cache_id .= (string) intval( $attributes['author'] );
		}

		if ( isset( $attributes['offset'] ) && $attributes['offset'] > 0 ) {
			$cache_id .= (string) intval( $attributes['offset'] );
		}

		return sanitize_key( $cache_id );
	}
}
