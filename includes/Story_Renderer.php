<?php
/**
 * Class Story_Renderer
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories;

/**
 * Class Story_Renderer
 */
class Story_Renderer {
	/*
	 * Regular expressions to fetch the individual structural tags.
	 * These patterns were optimized to avoid extreme backtracking on large documents.
	 */
	const HTML_STRUCTURE_HTML_START_TAG = '/^(?<html_start>[^<]*(?:\s*<!--[^>]*>\s*)*<html(?:\s+[^>]*)?>)/i';

	/**
	 * Current post.
	 *
	 * @var \WP_Post Post object.
	 */
	protected $post;

	/**
	 * Story_Renderer constructor.
	 *
	 * @param \WP_Post $post Post object.
	 */
	public function __construct( $post ) {
		$this->post = $post;
	}

	/**
	 * Replaces the HTML start tag to make the language attributes dynamic.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_html_start_tag( $content ) {
		if ( preg_match( self::HTML_STRUCTURE_HTML_START_TAG, $content, $matches ) ) {
			$replacement = sprintf( '<html amp %s>', get_language_attributes( 'html' ) );
			$result      = preg_replace( self::HTML_STRUCTURE_HTML_START_TAG, $replacement, $content, 1 );

			if ( null !== $result ) {
				return $result;
			}
		}

		return $content;
	}

	/**
	 * Returns the full HTML <head> markup for a given story besides boilerplate.
	 *
	 * @return string Filtered content.
	 */
	protected function get_html_head_markup() {
		ob_start();
		?>
		<meta name="generator" content="<?php printf( 'Web Stories %s', esc_attr( WEBSTORIES_VERSION ) ); ?>" />
		<?php

		/**
		 * Prints scripts or data in the head tag on the front end.
		 */
		do_action( 'web_stories_story_head' );

		return (string) ob_get_clean();
	}

	/**
	 * Replaces markers in HTML <head> with dynamic content.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_html_head( $content ) {
		$start_tag = '<meta name="web-stories-replace-head-start"/>';
		$end_tag   = '<meta name="web-stories-replace-head-end"/>';

		$start_tag_pos = strpos( $content, $start_tag );
		$end_tag_pos   = strpos( $content, $end_tag );

		if ( false !== $start_tag_pos && false !== $end_tag_pos ) {
			$end_tag_pos += strlen( $end_tag );
			$content      = substr_replace( $content, $this->get_html_head_markup(), $start_tag_pos, $end_tag_pos - $start_tag_pos );
		}

		return $content;
	}

	/**
	 * Replaces the placeholder of publisher logo in the content.
	 *
	 * @param string $content Original markup.
	 * @return string Filtered markup.
	 */
	protected function add_publisher_logo( $content ) {
		$publisher_logo = Story_Post_Type::get_publisher_logo();
		return str_replace( Story_Post_Type::PUBLISHER_LOGO_PLACEHOLDER, $publisher_logo, $content );
	}

	/**
	 * Adds square, and landscape poster images to the <amp-story>.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function add_poster_images( $content ) {
		$poster_images = Media::get_story_meta_images( $this->post );

		unset( $poster_images['poster-portrait'] ); // Already exists.

		foreach ( $poster_images as $attr => $url ) {
			$attr_markup = sprintf( '%1$s-src="%2$s"', $attr, $url );
			$content     = str_replace( 'poster-portrait-src=', $attr_markup . ' poster-portrait-src=', $content );
		}

		return $content;
	}

	/**
	 * Print amp-analytics script.
	 *
	 * @return void
	 */
	public function print_analytics_script() {
		?>
		<script async="async" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" custom-element="amp-analytics"></script>
		<?php
	}

	/**
	 * Prints AMP Analytics based on Site Kit configuration.
	 *
	 * @return void
	 */
	protected function print_amp_analytics() {
		if ( ! defined( 'GOOGLESITEKIT_PLUGIN_MAIN_FILE' ) ) {
			return;
		}
		$option = 'googlesitekit_analytics_settings';

		$site_kit_analytics = get_option( $option, [] );

		// Ensure filters used in Site Kit apply here, too.
		$tracking_id = apply_filters( 'googlesitekit_analytics_internal_web_property_id', '' );
		if ( empty( $tracking_id ) && ! empty( $site_kit_analytics['propertyID'] ) ) {
			$tracking_id = $site_kit_analytics['propertyID'];
		}
		if ( empty( $site_kit_analytics ) || empty( $tracking_id ) ) {
			return;
		}

		// If useSnippet is set and false, don't display anything.
		if ( isset( $site_kit_analytics['useSnippet'] ) && false === $site_kit_analytics['useSnippet'] ) {
			return;
		}

		if ( isset( $site_kit_analytics['trackingDisabled'] ) ) {
			$exclusions = $site_kit_analytics['trackingDisabled'];
			$disabled   = in_array( 'loggedinUsers', $exclusions, true ) && is_user_logged_in();
			if ( $disabled ) {
				return;
			}
		}

		$title    = $this->post->post_title;
		$story_id = $this->post->ID;
		$gtag     = [
			'vars'     => [
				'gtag_id' => $tracking_id,
				'config'  => [
					$tracking_id => [
						'groups' => 'default',
					],
				],
			],
			'triggers' => [
				'storyProgress' => [
					'on'   => 'story-page-visible',
					'vars' => [
						'event_name'     => 'custom',
						'event_action'   => 'story_progress',
						'event_category' => "$title",
						'event_label'    => "$story_id",
						'send_to'        => [
							$tracking_id,
						],
					],
				],
				'storyEnd'      => [
					'on'   => 'story-last-page-visible',
					'vars' => [
						'event_name'     => 'custom',
						'event_action'   => 'story_complete',
						'event_category' => "$title",
						'send_to'        => [
							$tracking_id,
						],
					],
				],
			],
		];

		/**
		 * Filters Analytics tag configuration.
		 *
		 * Allows modification or removal of the tag.
		 *
		 * @param array $gtag Array used to generate config for analytics.
		 */
		$gtag_filtered = apply_filters( 'web_stories_gtag', $gtag );

		// If the configuration was removed, don't display the tag.
		if ( empty( $gtag_filtered ) ) {
			return;
		}

		// Ensure gtag is still array.
		if ( ! is_array( $gtag_filtered ) ) {
			$gtag_filtered = $gtag;
		}

		if ( ! isset( $gtag_filtered['vars'] ) || ! is_array( $gtag_filtered['vars'] ) ) {
			$gtag_filtered['vars'] = $gtag['vars'];
		}

		$gtag_filtered['vars']['gtag_id'] = $tracking_id;

		?>
			<amp-analytics type="gtag" data-credentials="include">
				<script type="application/json">
					<?php echo wp_json_encode( $gtag_filtered ); ?>
				</script>
			</amp-analytics>
		<?php
	}

	/**
	 * Replaces the amp-story end tag to include amp-analytics tag if set up.
	 *
	 * @param string $content Story markup.
	 * @return string Updated story markup.
	 */
	protected function maybe_add_analytics( $content ) {
		ob_start();

		// @todo This would ideally be used in Site Kit plugin directly to reuse the method already existing there.
		do_action( 'web_stories_print_analytics' );

		$this->print_amp_analytics();

		$output = (string) ob_get_clean();

		// If analytics tag was added, let's include the required script, too.
		if ( ! empty( $output ) ) {
			add_action( 'web_stories_story_head', [ $this, 'print_analytics_script' ] );
		}
		return str_replace( '</amp-story>', $output . '</amp-story>', $content );
	}

	/**
	 * Replaces the body start tag to fire a custom action.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_body_start_tag( $content ) {
		ob_start();

		/**
		 * Prints scripts or data after opening the <body>.
		 */
		do_action( 'web_stories_body_open' );

		$output = (string) ob_get_clean();

		return str_replace( '<body>', '<body>' . $output, $content );
	}

	/**
	 * Replaces the body end tag to fire a custom action.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_body_end_tag( $content ) {
		ob_start();

		/**
		 * Prints scripts or data before closing the </body>.
		 */
		do_action( 'web_stories_footer' );

		$output = (string) ob_get_clean();

		return str_replace( '</body>', $output . '</body>', $content );
	}

	/**
	 * Renders the story.
	 *
	 * @return string The complete HTML markup for the story.
	 */
	public function render() {
		$markup = $this->post->post_content;
		$markup = $this->replace_html_start_tag( $markup );
		// Add before replace_html_head to leverage the `web_stories_story_head` action.
		$markup = $this->maybe_add_analytics( $markup );
		$markup = $this->replace_html_head( $markup );
		$markup = $this->add_poster_images( $markup );
		$markup = $this->add_publisher_logo( $markup );
		$markup = $this->replace_body_start_tag( $markup );
		$markup = $this->replace_body_end_tag( $markup );
		return $markup;
	}
}
